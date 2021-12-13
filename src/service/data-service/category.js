'use strict';

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  async findAll() {
    const categories = this._articles.reduce((acc, item) => {
      item.category.forEach((category) => acc.add(category));
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
