'use strict';

const {HttpCode} = require(`../../const`);

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const newArticleKeys = Object.keys(newArticle);
  const articleKeys = [`title`, `createdDate`, `announce`, `fullText`, `category`];

  const isArticleValid = articleKeys.every((key) => newArticleKeys.includes(key));

  if (!isArticleValid) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request. Article is not valid`);
  }

  return next();
};
