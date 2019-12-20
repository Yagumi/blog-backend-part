import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  ValidationPipe,
  UsePipes,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article-dto';
import { Article } from './article.entity';
import { GetArticlesFilterDto } from './dto/get-articles-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('articles')
@UseGuards(AuthGuard())
export class ArticlesController {
  constructor(private articleService: ArticlesService) {}

  @Get()
  getAllArticles(
    @Query(ValidationPipe) filterDto: GetArticlesFilterDto,
    @GetUser() user: User,
  ) {
    return this.articleService.getAllArticles(filterDto, user);
  }

  @Get('/:id')
  getArticleById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Article> {
    return this.articleService.getArticleById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @GetUser() user: User,
  ) {
    return this.articleService.createArticle(createArticleDto, user);
  }

  @Patch('/:id')
  updateArticle(
    @Param('id') id: number,
    @Body() createArticleDto: CreateArticleDto,
    @GetUser() user: User,
  ): Promise<Article> {
    return this.articleService.updateArticle(id, createArticleDto, user);
  }

  @Delete('/:id')
  deleteArticle(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.articleService.deleteArticle(id, user);
  }
}
