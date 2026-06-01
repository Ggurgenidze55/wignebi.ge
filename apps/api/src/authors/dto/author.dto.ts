import { IsArray, IsOptional, IsString } from 'class-validator';

export class AuthorDto {
  @IsString()
  slug!: string;

  @IsString()
  name!: string;

  @IsString()
  bio!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedSlugs?: string[];
}
