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
import { GenresService } from './genres.service';
import { GenreDto } from './dto/genre.dto';

type AuthReq = Request & { user: { id: string; email: string; role: Role } };

@Controller('admin/genres')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.EDITOR)
export class GenresAdminController {
  constructor(private genres: GenresService) {}

  @Get()
  list(@Query('trash') trash?: string) {
    return this.genres.findAllAdmin(trash === '1');
  }

  @Post()
  create(@Body() dto: GenreDto, @Req() req: AuthReq) {
    return this.genres.create(dto, req.user, req.ip);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<GenreDto>, @Req() req: AuthReq) {
    return this.genres.update(id, dto, req.user, req.ip);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthReq) {
    return this.genres.softDelete(id, req.user, req.ip);
  }

  @Post(':id/restore')
  restore(@Param('id') id: string, @Req() req: AuthReq) {
    return this.genres.restore(id, req.user, req.ip);
  }

  @Delete(':id/permanent')
  @Roles(Role.ADMIN)
  permanent(@Param('id') id: string, @Req() req: AuthReq) {
    return this.genres.permanentDelete(id, req.user, req.ip);
  }
}
