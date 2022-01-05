'use strict';

const Alias = require(`../models/alias`);

class ArticlesService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  async findAll(areCommentsNeeded) {
    const include = [Alias.CATEGORIES];

    if (areCommentsNeeded) {
      include.push(Alias.COMMENTS);
    }

    const articles = await this._Article.findAll({
      include,
      order: [[`createdAt`, `DESC`]],
    });
    return articles.map((article) => article.get());
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Alias.CATEGORIES, Alias.COMMENTS],
      order: [[`createdAt`, `DESC`]],
      distinct: true,
    });
    return {count, articles: rows};
  }

  async findOne(articleId) {
    return await this._Article.findByPk(articleId, {
      include: [Alias.CATEGORIES, Alias.COMMENTS]
    });
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async update(id, newData) {
    const [updatedRows] = await this._Article.update(newData, {where: {id}});
    return !!updatedRows;
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({where: {id}});

    return !!deletedRows;
  }
}

module.exports = ArticlesService;
