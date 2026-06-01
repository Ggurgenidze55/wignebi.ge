import { Controller, Get, Param } from '@nestjs/common';
import { AuthorsService } from './authors.service';

@Controller('authors')
export class AuthorsController {
  constructor(private authors: AuthorsService) {}

  @Get()
  list() {
    return this.authors.findAll();
  }

  @Get(':slug')
  one(@Param('slug') slug: string) {
    return this.authors.findBySlug(slug);
  }
}
