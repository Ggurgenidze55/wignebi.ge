import { IsArray, IsOptional, IsString } from 'class-validator';

export class GenreDto {
  @IsString()
  slug!: string;

  @IsString()
  name!: string;

  @IsString()
  nameEn!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedSlugs?: string[];
}
