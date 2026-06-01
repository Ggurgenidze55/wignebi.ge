import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsSafeUrl, IsSlug } from '../../common/validators';

export class AuthorDto {
  @IsSlug()
  slug!: string;

  @IsString()
  @MaxLength(200)
  name!: string;

  @IsString()
  @MaxLength(5000)
  bio!: string;

  @IsOptional()
  @IsSafeUrl()
  imageUrl?: string;

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
