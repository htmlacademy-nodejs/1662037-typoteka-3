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
          [
            Sequelize.fn(
                `COUNT`,
                Sequelize.col(`articleCategories.categoryId`),
            ),
            `count`,
          ],
        ],
        include: [
          {
            model: this._ArticleCategory,
            as: Alias.ARTICLE_CATEGORIES,
            attributes: [],
          },
        ],
        having: Sequelize.where(
            Sequelize.fn(`COUNT`, Sequelize.col(`articleCategories.categoryId`)),
            {
              [Sequelize.Op.gt]: 0,
            },
        ),
        group: [Sequelize.col(`Category.id`)],
        order: [[`name`, `ASC`]],
      });

      return result.map((item) => item.get());
    }

    return await this._Category.findAll({
      raw: true,
      order: [[`name`, `ASC`]],
    });
  }

  async findOne(id) {
    return await this._Category.findOne({
      attributes: [`id`, `name`],
      where: {id},
      raw: true,
    });
  }

  async findByName(name) {
    const category = await this._Category.findOne({where: {name}});
    return category && category.get();
  }

  async getArticlesByCategory(categoryId) {
    return await this._ArticleCategory.findAll({
      raw: true,
      where: {categoryId},
    });
  }

  async create(name) {
    return await this._Category.create({name});
  }

  async update(id, name) {
    const updatedRows = await this._Category.update({name}, {where: {id}});
    return !!updatedRows;
  }

  async drop(id) {
    const deletedRows = await this._Category.destroy({where: {id}});
    return !!deletedRows;
  }
}

module.exports = CategoryService;
