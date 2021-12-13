'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../const`);

class ArticlesService {
  constructor(articles) {
    this._articles = articles;
  }

  async findAll() {
    return this._articles;
  }

  async findOne(articleId) {
    return this._articles.find((item) => item.id === articleId);
  }

  async create(article) {
    const newArticle = Object.assign(
        {id: nanoid(MAX_ID_LENGTH), comments: []},
        article,
    );
    this._articles.push(newArticle);

    return newArticle;
  }

  async update(oldArticle, newArticle) {
    return Object.assign(oldArticle, newArticle);
  }

  async delete(article) {
    const deletedItem = this._articles.splice(this._articles.indexOf(article), 1);

    return deletedItem[0];
  }

  async deleteComment(article, commentId) {
    const deletedComment = article.comments.find((item) => item.id === commentId);

    if (deletedComment) {
      article.comments.splice(article.comments.indexOf(deletedComment), 1);
    }

    return deletedComment;
  }

  async postComment(article, comment) {
    const newComment = Object.assign({id: nanoid(MAX_ID_LENGTH)}, comment);

    article.comments.push(newComment);

    return newComment;
  }
}

module.exports = ArticlesService;
