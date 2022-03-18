'use strict';

const Alias = require(`../models/alias`);


class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async findAll(articleId) {
    return await this._Comment.findAll({
      where: {articleId},
      raw: true,
      include: [
        {
          model: this._User,
          as: Alias.USERS,
          attributes: [`avatar`, `name`],
        },
      ],
    });
  }

  async findLatest(limit) {
    const comments = await this._Comment.findAll({
      attributes: [`articleId`, `text`, `createdAt`],
      include: [
        {
          model: this._User,
          as: Alias.USERS,
          attributes: [`avatar`, `name`, `surname`],
        },
      ],
      order: [[`createdAt`, `DESC`]],
      limit,
      subQuery: false,
    });

    return comments.map((article) => article.get());
  }

  async create(articleId, commentData) {
    return await this._Comment.create({articleId, ...commentData});
  }

  async drop(commentId) {
    const deletedRowsCount = await this._Comment.destroy({
      where: {
        id: commentId,
      },
    });
    return !!deletedRowsCount;
  }
}

module.exports = CommentService;
