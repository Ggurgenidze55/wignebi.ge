import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth-admin/jwt-auth.guard';
import { Roles } from '../auth-admin/roles.decorator';
import { RolesGuard } from '../auth-admin/roles.guard';
import { MediaService } from './media.service';

@Controller('admin/media')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.EDITOR)
export class MediaAdminController {
  constructor(private media: MediaService) {}

  @Get()
  list(@Query('q') q?: string) {
    return this.media.findAll(q);
  }

  @Post('upload')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 100 * 1024 * 1024 } }))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user: { id: string; email: string } },
  ) {
    if (!file) throw new BadRequestException('No file');
    return this.media.upload(file, req.user.id, req.user.email, req.ip);
  }

  @Post(':id/replace')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 100 * 1024 * 1024 } }))
  replace(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request & { user: { id: string; email: string } },
  ) {
    if (!file) throw new BadRequestException('No file');
    return this.media.replace(id, file, req.user.id, req.user.email, req.ip);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request & { user: { id: string; email: string } }) {
    return this.media.softDelete(id, req.user.id, req.user.email, req.ip);
  }
}
