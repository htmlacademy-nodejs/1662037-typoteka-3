'use strict';

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
}

module.exports = ArticlesService;
