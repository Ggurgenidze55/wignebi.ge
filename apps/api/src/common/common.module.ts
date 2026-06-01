import { Global, Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { SlugService } from './slug.service';

@Global()
@Module({
  providers: [AuditService, SlugService],
  exports: [AuditService, SlugService],
})
export class CommonModule {}
