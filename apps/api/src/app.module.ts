import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthAdminModule } from './auth-admin/auth-admin.module';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { GenresModule } from './genres/genres.module';

@Module({
  imports: [PrismaModule, AuthAdminModule, BooksModule, AuthorsModule, GenresModule],
})
export class AppModule {}
