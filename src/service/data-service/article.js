'use strict';

const Alias = require(`../models/alias`);
const {Sequelize} = require(`sequelize`);

class ArticlesService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._User = sequelize.models.User;
    this._Comment = sequelize.models.Comment;
  }

  async findAll(areCommentsNeeded) {
    const include = [
      Alias.CATEGORIES,
      {
        model: this._User,
        as: Alias.USERS,
        attributes: {exclude: [`passwordHash`]},
      },
    ];

    if (areCommentsNeeded) {
      include.push({
        model: this._Comment,
        as: Alias.COMMENTS,
        include: [
          {
            model: this._User,
            as: Alias.USERS,
            attributes: {exclude: [`passwordHash`]},
          },
        ],
      });
    }

    const articles = await this._Article.findAll({
      include,
      order: [[`createdAt`, `DESC`]],
    });
    return articles.map((article) => article.get());
  }

  async findMostCommented(limit) {
    const articles = await this._Article.findAll({
      attributes: [
        `id`,
        `title`,
        [Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)), `commentsCount`],
      ],
      include: [
        {
          model: this._Comment,
          as: Alias.COMMENTS,
          attributes: [],
        },
      ],
      group: [Sequelize.col(`Article.id`)],
      order: [[Sequelize.col(`commentsCount`), `DESC`]],
      having: Sequelize.where(
          Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)),
          {
            [Sequelize.Op.gt]: 0,
          },
      ),
      limit,
      subQuery: false,
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
      include: [
        Alias.CATEGORIES,
        {
          model: this._Comment,
          as: Alias.COMMENTS,
          include: [
            {
              model: this._User,
              as: Alias.USERS,
              attributes: {exclude: [`passwordHash`]},
            },
          ],
        },
        {
          model: this._User,
          as: Alias.USERS,
          attributes: {exclude: [`passwordHash`]},
        },
      ],
    });
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async update(id, newData) {
    const [updatedRows] = await this._Article.update(newData, {where: {id}});

    const article = await this._Article.findByPk(id);
    await article.setCategories(newData.categories);

    return !!updatedRows;
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({where: {id}});

    return !!deletedRows;
  }
}

module.exports = ArticlesService;
