import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { GenresAdminController } from './genres-admin.controller';
import { GenresService } from './genres.service';

@Module({
  controllers: [GenresController, GenresAdminController],
  providers: [GenresService],
})
export class GenresModule {}
