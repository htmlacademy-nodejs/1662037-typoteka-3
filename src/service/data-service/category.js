'use strict';

const Sequelize = require(`sequelize`);
const Alias = require(`../models/alias`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(isCountNeeded) {
    if (isCountNeeded) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [Sequelize.fn(`COUNT`, `*`), `count`]],
        include: [
          {
            model: this._ArticleCategory,
            as: Alias.ARTICLE_CATEGORIES,
            attributes: [],
          },
        ],
        group: [Sequelize.col(`id`)],
      });
      return result.map((item) => item.get());
    }

    return await this._Category.findAll({raw: true});
  }
}

module.exports = CategoryService;
