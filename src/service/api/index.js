'use strict';

const {Router} = require(`express`);
const {CategoryService, ArticlesService} = require(`../data-service`);
const getMockData = require(`../lib/get-mock-data`);
const registerCategoryRoutes = require(`./category`);
const registerArticlesRoutes = require(`./article`);

const apiRouter = new Router();

(async () => {
  const mockData = await getMockData();

  registerCategoryRoutes(apiRouter, new CategoryService(mockData));
  registerArticlesRoutes(apiRouter, new ArticlesService(mockData));
})();

module.exports = apiRouter;
