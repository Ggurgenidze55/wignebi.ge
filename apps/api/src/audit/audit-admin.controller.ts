import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuditService } from '../common/audit.service';
import { JwtAuthGuard } from '../auth-admin/jwt-auth.guard';
import { Roles } from '../auth-admin/roles.decorator';
import { RolesGuard } from '../auth-admin/roles.guard';

@Controller('admin/audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AuditAdminController {
  constructor(private audit: AuditService) {}

  @Get()
  list(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.audit.findAll(Number(skip ?? 0), Number(take ?? 100));
  }
}
