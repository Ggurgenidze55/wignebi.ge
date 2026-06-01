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
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';

type AuthReq = Request & { user: { id: string; email: string; role: Role } };

@Controller('admin/books')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.EDITOR)
export class BooksAdminController {
  constructor(private books: BooksService) {}

  @Get()
  list(@Query('trash') trash?: string) {
    return this.books.findAllAdmin(trash === '1');
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.books.findOneAdmin(id);
  }

  @Post()
  create(@Body() dto: CreateBookDto, @Req() req: AuthReq) {
    return this.books.create(dto, req.user, req.ip);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto, @Req() req: AuthReq) {
    return this.books.update(id, dto, req.user, req.ip);
  }

  @Post(':id/restore')
  restore(@Param('id') id: string, @Req() req: AuthReq) {
    return this.books.restore(id, req.user, req.ip);
  }

  @Delete(':id/permanent')
  @Roles(Role.ADMIN)
  permanent(@Param('id') id: string, @Req() req: AuthReq) {
    return this.books.permanentDelete(id, req.user, req.ip);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthReq) {
    return this.books.softDelete(id, req.user, req.ip);
  }
}
