import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth-admin/jwt-auth.guard';
import { GenresService } from './genres.service';
import { GenreDto } from './dto/genre.dto';

@Controller('admin/genres')
@UseGuards(JwtAuthGuard)
export class GenresAdminController {
  constructor(private genres: GenresService) {}

  @Get()
  list() {
    return this.genres.findAll();
  }

  @Post()
  create(@Body() dto: GenreDto) {
    return this.genres.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<GenreDto>) {
    return this.genres.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genres.remove(id);
  }
}
