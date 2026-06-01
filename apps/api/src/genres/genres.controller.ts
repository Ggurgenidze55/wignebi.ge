import { Controller, Get, Param } from '@nestjs/common';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private genres: GenresService) {}

  @Get()
  list() {
    return this.genres.findAll();
  }

  @Get(':slug')
  one(@Param('slug') slug: string) {
    return this.genres.findBySlug(slug);
  }
}
