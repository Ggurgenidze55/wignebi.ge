import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsSafeUrl, IsSlug } from '../../common/validators';

export class ChapterDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsInt()
  @Min(0)
  durationSec!: number;

  @IsOptional()
  @IsSafeUrl()
  audioUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readingParagraphs?: string[];
}

export class CreateBookDto {
  @IsSlug()
  slug!: string;

  @IsString()
  @MaxLength(300)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  titleEn?: string;

  @IsString()
  @MaxLength(5000)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @IsString()
  @MaxLength(200)
  narrator!: string;

  @IsSlug()
  authorSlug!: string;

  @IsOptional()
  @IsInt()
  coverHue?: number;

  @IsOptional()
  @IsSafeUrl()
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
  @IsSlug()
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  titleEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(200)
  narrator?: string;

  @IsOptional()
  @IsSlug()
  authorSlug?: string;

  @IsOptional()
  @IsInt()
  coverHue?: number;

  @IsOptional()
  @IsSafeUrl()
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
