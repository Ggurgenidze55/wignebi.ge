import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { mapAuthor } from '../common/mappers';
import type { AuthorDto } from './dto/author.dto';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const rows = await this.prisma.author.findMany({ orderBy: { name: 'asc' } });
    return rows.map(mapAuthor);
  }

  async findBySlug(slug: string) {
    const row = await this.prisma.author.findUnique({ where: { slug } });
    if (!row) throw new NotFoundException();
    return mapAuthor(row);
  }

  async findAllAdmin() {
    return this.findAll();
  }

  async create(dto: AuthorDto) {
    const row = await this.prisma.author.create({ data: dto });
    return mapAuthor(row);
  }

  async update(id: string, dto: Partial<AuthorDto>) {
    const row = await this.prisma.author.update({ where: { id }, data: dto });
    return mapAuthor(row);
  }

  async remove(id: string) {
    await this.prisma.author.delete({ where: { id } });
    return { ok: true };
  }
}
