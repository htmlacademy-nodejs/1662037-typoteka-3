'use strict';

const {Router} = require(`express`);
const {CategoryService, ArticlesService, SearchService, CommentService} = require(`../data-service`);
const defineModels = require(`../models`);
const sequelize = require(`../lib/sequelize`);
const registerCategoryRoutes = require(`./category`);
const registerArticlesRoutes = require(`./article`);
const registerSearchService = require(`./search`);

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
})();

module.exports = apiRouter;
