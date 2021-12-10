'use strict';

const {Router} = require(`express`);
const {CategoryService} = require(`../data-service`);
const getMockData = require(`../lib/get-mock-data`);
const registerCategoryRoutes = require(`./category`);

const apiRouter = new Router();

(async () => {
  const mockData = await getMockData();

  registerCategoryRoutes(apiRouter, new CategoryService(mockData));
})();

module.exports = apiRouter;
