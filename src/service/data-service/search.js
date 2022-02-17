'use strict';

const {Op} = require(`sequelize`);
const Alias = require(`../models/alias`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._User = sequelize.models.User;
  }

  async findAll(query) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: query,
        },
      },
      include: [
        Alias.CATEGORIES,
        {
          model: this._User,
          as: Alias.USERS,
          attributes: {exclude: [`passwordHash`]},
        },
      ],
      order: [[`createdAt`, `DESC`]],
    });

    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
