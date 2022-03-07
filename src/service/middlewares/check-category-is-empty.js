'use strict';
const {HttpCode} = require(`../../const`);

module.exports = (service) => async (req, res, next) => {
  const {id} = req.params;

  const categoriesWithArticles = await service.getArticlesByCategory(id);

  if (categoriesWithArticles.length !== 0) {
    return res.status(HttpCode.BAD_REQUEST).send(`Category with id ${id} has articles`);
  }

  return next();
};
