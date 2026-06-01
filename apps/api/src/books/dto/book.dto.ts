import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ChapterDto {
  @IsString()
  title!: string;

  @IsInt()
  @Min(0)
  durationSec!: number;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readingParagraphs?: string[];
}

export class CreateBookDto {
  @IsString()
  slug!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsString()
  description!: string;

  @IsString()
  narrator!: string;

  @IsString()
  authorSlug!: string;

  @IsOptional()
  @IsInt()
  coverHue?: number;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsIn(['free', 'subscription', 'premium'])
  access!: 'free' | 'subscription' | 'premium';

  @IsOptional()
  @IsInt()
  priceGel?: number;

  @IsOptional()
  @IsInt()
  durationSec?: number;

  @IsArray()
  @IsString({ each: true })
  genreSlugs!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsString()
  publishedAt!: string;

  @IsOptional()
  @IsInt()
  popularity?: number;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChapterDto)
  chapters?: ChapterDto[];
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  narrator?: string;

  @IsOptional()
  @IsString()
  authorSlug?: string;

  @IsOptional()
  @IsInt()
  coverHue?: number;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsIn(['free', 'subscription', 'premium'])
  access?: 'free' | 'subscription' | 'premium';

  @IsOptional()
  @IsInt()
  priceGel?: number;

  @IsOptional()
  @IsInt()
  durationSec?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genreSlugs?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  publishedAt?: string;

  @IsOptional()
  @IsInt()
  popularity?: number;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChapterDto)
  chapters?: ChapterDto[];
}
