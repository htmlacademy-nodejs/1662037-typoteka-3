'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const query = req.query.query;

    const foundItem = await service.find(query);

    if (!foundItem) {
      res.status(HttpCode.NOT_FOUND).send(`Nothing found with "${query}"`);
    }

    return res.status(HttpCode.OK).json(foundItem);
  });
};

