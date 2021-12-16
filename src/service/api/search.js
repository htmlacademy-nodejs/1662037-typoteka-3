'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);


module.exports = (app, service) => {
  const route = new Router();
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const {query = ``} = req.query;

    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).send(`Bad request. Search request should not be empty`);
    }

    const foundItem = await service.find(query);

    return !foundItem
      ? res.status(HttpCode.NOT_FOUND).send(`Nothing found with "${query}"`)
      : res.status(HttpCode.OK).json(foundItem);
  });
};
