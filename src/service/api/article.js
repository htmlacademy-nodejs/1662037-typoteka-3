'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

const router = new Router();

module.exports = (app, service) => {
  app.use(`/articles`, router);

  router.get(`/`, async (req, res) => {
    const articles = await service.findAll();

    return res.status(HttpCode.OK).json(articles);
  });

  router.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;

    const article = await service.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Article with id ${articleId} not found`);
    }

    return res.status(HttpCode.OK).json(article);
  });
};
