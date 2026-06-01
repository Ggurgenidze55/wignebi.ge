import { Controller, Get, Param } from '@nestjs/common';
import { SlugEntityType } from '@prisma/client';
import { SlugService } from '../common/slug.service';

@Controller('redirects')
export class RedirectsController {
  constructor(private slugs: SlugService) {}

  @Get('book/:slug')
  book(@Param('slug') slug: string) {
    return this.resolve(SlugEntityType.BOOK, slug);
  }

  @Get('author/:slug')
  author(@Param('slug') slug: string) {
    return this.resolve(SlugEntityType.AUTHOR, slug);
  }

  @Get('genre/:slug')
  genre(@Param('slug') slug: string) {
    return this.resolve(SlugEntityType.GENRE, slug);
  }

  private async resolve(entityType: SlugEntityType, slug: string) {
    const row = await this.slugs.resolve(entityType, slug);
    if (!row) return { redirect: false };
    return { redirect: true, newSlug: row.newSlug, entityId: row.entityId };
  }
}
