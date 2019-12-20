import { Repository, EntityRepository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article-dto';
import { GetArticlesFilterDto } from './dto/get-articles-filter.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Article)
export class ArticleRpository extends Repository<Article> {
  async getAllArticles(
    filterDto: GetArticlesFilterDto,
    user: User,
  ): Promise<Article[]> {
    const { search } = filterDto;
    console.log(search);
    const query = this.createQueryBuilder('article');

    query.where('article.userId = :userId', { userId: user.id });

    if (search) {
      query.andWhere(
        '(article.title LIKE :search OR article.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    const articles = await query.getMany();
    return articles;
  }

  async createArticle(
    createArticleDto: CreateArticleDto,
    user: User,
  ): Promise<Article> {
    const { title, description } = createArticleDto;
    const article = new Article();

    article.title = title;
    article.description = description;
    article.user = user;
    await article.save();

    delete article.user;
    return article;
  }
}
