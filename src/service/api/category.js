'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

const router = new Router();

module.exports = (app, service) => {
  app.use(`/category`, router);

  router.get(`/`, async (req, res) => {
    const categories = await service.findAll();
    res.status(HttpCode.OK).json(categories);
  });
};
