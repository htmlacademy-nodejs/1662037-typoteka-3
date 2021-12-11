'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  async find(query) {
    const regex = new RegExp(`${query}`);
    let result = [];

    this._articles.forEach((item) => regex.test(item.title) && result.push(item));

    if (result.length === 0) {
      return null;
    }

    return result;
  }
}

module.exports = SearchService;
