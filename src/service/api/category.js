'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);


module.exports = (app, service) => {
  const router = new Router();
  app.use(`/categories`, router);

  router.get(`/`, async (req, res) => {
    const {count} = req.query;

    const categories = await service.findAll(count);
    res.status(HttpCode.OK).json(categories);
  });

  router.get(`/:id`, async (req, res) => {
    const {id} = req.params;

    const category = await service.findOne(id);
    res.status(HttpCode.OK).json(category);
  });
};
