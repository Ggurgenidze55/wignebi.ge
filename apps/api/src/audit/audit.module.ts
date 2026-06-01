import { Module } from '@nestjs/common';
import { AuditAdminController } from './audit-admin.controller';

@Module({ controllers: [AuditAdminController] })
export class AuditModule {}
