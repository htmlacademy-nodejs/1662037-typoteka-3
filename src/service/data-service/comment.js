'use strict';

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._Article = sequelize.models.Article;
  }

  async findAll(articleId) {
    return await this._Comment.findAll({
      where: {articleId},
      raw: true,
    });
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
