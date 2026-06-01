import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuditAction, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { Response } from 'express';
import { AuditService } from '../common/audit.service';
import {
  ACCESS_COOKIE,
  ACCESS_TTL_MS,
  REFRESH_COOKIE,
  REFRESH_TTL_MS,
  cookieOptions,
} from '../config/env.validation';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthAdminService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private audit: AuditService,
  ) {}

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private signAccess(user: { id: string; email: string; role: Role }) {
    return this.jwt.sign(
      { sub: user.id, email: user.email, role: user.role, type: 'access' } satisfies JwtPayload,
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );
  }

  private signRefresh(user: { id: string; email: string; role: Role }) {
    return this.jwt.sign(
      { sub: user.id, email: user.email, role: user.role, type: 'refresh' },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );
  }

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie(ACCESS_COOKIE, accessToken, cookieOptions(ACCESS_TTL_MS));
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions(REFRESH_TTL_MS));
  }

  clearAuthCookies(res: Response) {
    res.clearCookie(ACCESS_COOKIE, { path: '/' });
    res.clearCookie(REFRESH_COOKIE, { path: '/' });
  }

  async issueTokens(user: { id: string; email: string; role: Role; name?: string | null }, res?: Response) {
    const accessToken = this.signAccess(user);
    const refreshToken = randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);
    await this.prisma.refreshToken.create({
      data: { userId: user.id, tokenHash: this.hashToken(refreshToken), expiresAt },
    });
    const signedRefresh = this.signRefresh(user);
    if (res) this.setAuthCookies(res, accessToken, signedRefresh);
    return {
      accessToken,
      refreshToken: signedRefresh,
      rawRefresh: refreshToken,
      user: { id: user.id, email: user.email, name: user.name ?? undefined, role: user.role },
    };
  }

  async login(email: string, password: string, res: Response, ip?: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      await this.audit.log({ action: AuditAction.LOGIN_FAILED, userEmail: email, ipAddress: ip });
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.issueTokens(user, res);
    await this.audit.log({
      userId: user.id,
      userEmail: user.email,
      action: AuditAction.LOGIN_SUCCESS,
      ipAddress: ip,
    });
    return { user: tokens.user };
  }

  async refresh(refreshCookie: string | undefined, res: Response) {
    if (!refreshCookie) throw new UnauthorizedException('No refresh token');
    let payload: { sub: string; type?: string };
    try {
      payload = this.jwt.verify(refreshCookie, { secret: process.env.JWT_REFRESH_SECRET });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (payload.type !== 'refresh') throw new UnauthorizedException();

    const user = await this.prisma.adminUser.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException();

    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(user, res);
  }

  async logout(userId: string | undefined, res: Response, ip?: string, email?: string) {
    if (userId) {
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      await this.audit.log({
        userId,
        userEmail: email,
        action: AuditAction.LOGOUT,
        ipAddress: ip,
      });
    }
    this.clearAuthCookies(res);
    return { ok: true };
  }

  async validateAdmin(userId: string) {
    return this.prisma.adminUser.findUnique({ where: { id: userId } });
  }

  /** BFF-only: returns tokens in body for Next.js to set HttpOnly cookies */
  async loginForBff(email: string, password: string, ip?: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      await this.audit.log({ action: AuditAction.LOGIN_FAILED, userEmail: email, ipAddress: ip });
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.issueTokens(user);
    await this.audit.log({
      userId: user.id,
      userEmail: user.email,
      action: AuditAction.LOGIN_SUCCESS,
      ipAddress: ip,
    });
    return tokens;
  }

  async refreshForBff(refreshToken: string) {
    let payload: { sub: string; type?: string };
    try {
      payload = this.jwt.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (payload.type !== 'refresh') throw new UnauthorizedException();
    const user = await this.prisma.adminUser.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException();
    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return this.issueTokens(user);
  }
}
