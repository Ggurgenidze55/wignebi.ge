import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthAdminController } from './auth-admin.controller';
import { AuthAdminService } from './auth-admin.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-tsignebi-jwt-change-me',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthAdminController],
  providers: [AuthAdminService, JwtStrategy],
  exports: [AuthAdminService, JwtModule],
})
export class AuthAdminModule {}
