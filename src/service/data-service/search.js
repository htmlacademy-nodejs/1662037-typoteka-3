'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  async find(query) {
    const regex = new RegExp(`${query}`);

    const result = this._articles.filter((item) => regex.test(item.title));

    return (result.length === 0) ? null : result;
  }
}

module.exports = SearchService;
