import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthAdminService } from './auth-admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthAdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'dev-tsignebi-jwt-change-me',
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.auth.validateAdmin(payload.sub);
    if (!user) throw new UnauthorizedException();
    return { id: user.id, email: user.email, role: 'admin' as const };
  }
}
