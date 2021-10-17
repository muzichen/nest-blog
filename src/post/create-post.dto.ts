import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
