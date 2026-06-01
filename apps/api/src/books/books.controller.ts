import { Controller, Get, Param, Query } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private books: BooksService) {}

  @Get()
  list(
    @Query('access') access?: string,
    @Query('genre') genre?: string,
    @Query('author') author?: string,
    @Query('isNew') isNew?: string,
    @Query('sort') sort?: 'popular' | 'new',
    @Query('limit') limit?: string,
  ) {
    return this.books.findPublished({
      access,
      genreSlug: genre,
      authorSlug: author,
      isNew: isNew === '1' || isNew === 'true',
      sort,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':slug/reading/:chapterId')
  reading(@Param('slug') slug: string, @Param('chapterId') chapterId: string) {
    return this.books.getReadingParagraphs(slug, chapterId);
  }

  @Get(':slug')
  one(@Param('slug') slug: string) {
    return this.books.findBySlug(slug);
  }
}
