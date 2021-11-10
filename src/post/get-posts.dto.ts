import { IsNumber, IsOptional } from 'class-validator';

export default class GetPostsDto {
  @IsOptional()
  @IsNumber()
  pageSize?: number;
  @IsOptional()
  @IsNumber()
  currentPage?: number;
}
