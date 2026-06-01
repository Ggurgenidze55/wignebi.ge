import { Module } from '@nestjs/common';
import { AuthorsController } from './authors.controller';
import { AuthorsAdminController } from './authors-admin.controller';
import { AuthorsService } from './authors.service';

@Module({
  controllers: [AuthorsController, AuthorsAdminController],
  providers: [AuthorsService],
})
export class AuthorsModule {}
