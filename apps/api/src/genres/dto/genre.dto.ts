import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsSlug } from '../../common/validators';

export class GenreDto {
  @IsSlug()
  slug!: string;

  @IsString()
  @MaxLength(200)
  name!: string;

  @IsString()
  @MaxLength(200)
  nameEn!: string;

  @IsString()
  @MaxLength(2000)
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
  relatedSlugs?: string[];
}
