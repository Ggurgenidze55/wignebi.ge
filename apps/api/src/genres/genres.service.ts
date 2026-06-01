import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { mapGenre } from '../common/mappers';
import type { GenreDto } from './dto/genre.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const rows = await this.prisma.genre.findMany({ orderBy: { name: 'asc' } });
    return rows.map(mapGenre);
  }

  async findBySlug(slug: string) {
    const row = await this.prisma.genre.findUnique({ where: { slug } });
    if (!row) throw new NotFoundException();
    return mapGenre(row);
  }

  async create(dto: GenreDto) {
    const row = await this.prisma.genre.create({ data: dto });
    return mapGenre(row);
  }

  async update(id: string, dto: Partial<GenreDto>) {
    const row = await this.prisma.genre.update({ where: { id }, data: dto });
    return mapGenre(row);
  }

  async remove(id: string) {
    await this.prisma.genre.delete({ where: { id } });
    return { ok: true };
  }
}
