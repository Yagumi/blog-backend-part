import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetArticlesFilterDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
