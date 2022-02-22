'use strict';

const CategoryService = require(`./category`);
const ArticlesService = require(`./article`);
const SearchService = require(`./search`);
const CommentService = require(`./comment`);
const UserService = require(`./user`);
const RefreshTokenService = require(`./refresh-token`);

module.exports = {
  CategoryService,
  ArticlesService,
  SearchService,
  CommentService,
  UserService,
  RefreshTokenService
};
