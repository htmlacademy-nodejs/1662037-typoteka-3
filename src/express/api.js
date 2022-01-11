'use strict';

const axios = require(`axios`);

const TIMEOUT = 1000;
const DEFAULT_PORT = 3000;

const port = process.env.API_PORT || DEFAULT_PORT;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({comments, offset, limit} = {}) {
    return this._load(`/articles`, {params: {comments, offset, limit}});
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories({count} = {}) {
    return this._load(`/category`, {params: {count}});
  }

  async createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data,
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
