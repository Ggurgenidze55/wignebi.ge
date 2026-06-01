import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth-admin/jwt-auth.guard';
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';

@Controller('admin/books')
@UseGuards(JwtAuthGuard)
export class BooksAdminController {
  constructor(private books: BooksService) {}

  @Get()
  list() {
    return this.books.findAllAdmin();
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.books.findOneAdmin(id);
  }

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.books.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.books.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.books.remove(id);
  }
}
