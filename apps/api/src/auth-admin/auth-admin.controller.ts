import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Request, Response } from 'express';
import { REFRESH_COOKIE } from '../config/env.validation';
import { AuthAdminService } from './auth-admin.service';
import { JwtAuthGuard } from './jwt-auth.guard';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

@Controller('admin/auth')
export class AuthAdminController {
  constructor(private auth: AuthAdminService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const bff = req.headers['x-bff-request'] === process.env.BFF_SECRET;
    if (bff) {
      return this.auth.loginForBff(dto.email, dto.password, req.ip);
    }
    return this.auth.login(dto.email, dto.password, res, req.ip);
  }

  @Post('refresh')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const bff = req.headers['x-bff-request'] === process.env.BFF_SECRET;
    const token = req.cookies?.[REFRESH_COOKIE] ?? req.body?.refreshToken;
    if (bff) {
      if (!token) throw new UnauthorizedException();
      return this.auth.refreshForBff(token);
    }
    return this.auth.refresh(token, res);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request & { user?: { id: string; email: string } }, @Res({ passthrough: true }) res: Response) {
    return this.auth.logout(req.user?.id, res, req.ip, req.user?.email);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request & { user?: { id: string; email: string; role: string; name?: string } }) {
    return { user: req.user };
  }
}
