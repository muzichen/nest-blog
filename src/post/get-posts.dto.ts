import { IsNumber, IsOptional, IsString } from 'class-validator';

export default class GetPostsDto {
  @IsOptional()
  @IsNumber()
  pageSize?: number;
  @IsOptional()
  @IsNumber()
  currentPage?: number;
  @IsOptional()
  @IsString()
  tag?: string;
}
