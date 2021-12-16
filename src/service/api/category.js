'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);


module.exports = (app, service) => {
  const router = new Router();
  app.use(`/category`, router);

  router.get(`/`, async (req, res) => {
    const categories = await service.findAll();
    res.status(HttpCode.OK).json(categories);
  });
};
