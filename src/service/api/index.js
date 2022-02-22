'use strict';

const {Router} = require(`express`);
const {CategoryService, ArticlesService, SearchService, CommentService, UserService, RefreshTokenService} = require(`../data-service`);
const defineModels = require(`../models`);
const sequelize = require(`../lib/sequelize`);
const registerCategoryRoutes = require(`./category`);
const registerArticlesRoutes = require(`./article`);
const registerSearchService = require(`./search`);
const registerUserRoutes = require(`./user`);

const apiRouter = new Router();

defineModels(sequelize);
(async () => {
  registerCategoryRoutes(apiRouter, new CategoryService(sequelize));
  registerArticlesRoutes(
      apiRouter,
      new ArticlesService(sequelize),
      new CommentService(sequelize),
  );
  registerSearchService(apiRouter, new SearchService(sequelize));
  registerUserRoutes(apiRouter, new UserService(sequelize), new RefreshTokenService(sequelize));
})();

module.exports = apiRouter;
