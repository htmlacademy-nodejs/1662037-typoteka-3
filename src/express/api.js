'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`../const`);

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
      method: HttpMethod.POST,
      data,
    });
  }

  async editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data,
    });
  }

  async createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data,
    });
  }

  async createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data,
    });
  }

  async auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password},
    });
  }

  async refresh(token) {
    return this._load(`/user/refresh`, {
      method: HttpMethod.POST,
      data: {token},
    });
  }

  async logout(refreshToken) {
    return this._load(`/user/logout`, {
      method: HttpMethod.POST,
      data: {refreshToken},
    });
  }

  async checkAdmin(email) {
    return this._load(`/user/admin`, {
      method: HttpMethod.POST,
      data: {email},
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
