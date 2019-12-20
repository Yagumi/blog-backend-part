import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleRpository } from './article.repository';
import { CreateArticleDto } from './dto/create-article-dto';
import { Article } from './article.entity';
import { GetArticlesFilterDto } from './dto/get-articles-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleRpository)
    private articleRepository: ArticleRpository,
  ) {}

  async getAllArticles(
    filterDto: GetArticlesFilterDto,
    user: User,
  ): Promise<Article[]> {
    return await this.articleRepository.getAllArticles(filterDto, user);
  }

  async getArticleById(id: number, user: User): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!article) {
      throw new NotFoundException(`Post with id: ${id} not found!`);
    }

    return article;
  }

  async createArticle(
    createArticleDto: CreateArticleDto,
    user: User,
  ): Promise<Article> {
    return this.articleRepository.createArticle(createArticleDto, user);
  }

  async updateArticle(
    id: number,
    createArticleDto: CreateArticleDto,
    user: User,
  ): Promise<Article> {
    const { title, description } = createArticleDto;
    const result = await this.getArticleById(id, user);

    if (!result) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    result.title = title;
    result.description = description;
    await result.save();

    return result;
  }

  async deleteArticle(id: number, user: User): Promise<void> {
    const result = await this.articleRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
