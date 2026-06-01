import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth-admin/jwt-auth.guard';
import { AuthorsService } from './authors.service';
import { AuthorDto } from './dto/author.dto';

@Controller('admin/authors')
@UseGuards(JwtAuthGuard)
export class AuthorsAdminController {
  constructor(private authors: AuthorsService) {}

  @Get()
  list() {
    return this.authors.findAllAdmin();
  }

  @Post()
  create(@Body() dto: AuthorDto) {
    return this.authors.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<AuthorDto>) {
    return this.authors.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authors.remove(id);
  }
}
