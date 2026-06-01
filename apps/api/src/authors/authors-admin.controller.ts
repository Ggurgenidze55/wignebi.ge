import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth-admin/jwt-auth.guard';
import { Roles } from '../auth-admin/roles.decorator';
import { RolesGuard } from '../auth-admin/roles.guard';
import { AuthorsService } from './authors.service';
import { AuthorDto } from './dto/author.dto';

type AuthReq = Request & { user: { id: string; email: string; role: Role } };

@Controller('admin/authors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.EDITOR)
export class AuthorsAdminController {
  constructor(private authors: AuthorsService) {}

  @Get()
  list(@Query('trash') trash?: string) {
    return this.authors.findAllAdmin(trash === '1');
  }

  @Post()
  create(@Body() dto: AuthorDto, @Req() req: AuthReq) {
    return this.authors.create(dto, req.user, req.ip);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<AuthorDto>, @Req() req: AuthReq) {
    return this.authors.update(id, dto, req.user, req.ip);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthReq) {
    return this.authors.softDelete(id, req.user, req.ip);
  }

  @Post(':id/restore')
  restore(@Param('id') id: string, @Req() req: AuthReq) {
    return this.authors.restore(id, req.user, req.ip);
  }

  @Delete(':id/permanent')
  @Roles(Role.ADMIN)
  permanent(@Param('id') id: string, @Req() req: AuthReq) {
    return this.authors.permanentDelete(id, req.user, req.ip);
  }
}
