'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const myRouter = new Router();
const api = getAPI();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`admin/my`, {articles});
});
myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();
  const comments = articles.flatMap((article) => article.comments);
  res.render(`admin/comments`, {articles, comments});
});
myRouter.get(`/post`, (req, res) => res.render(`admin/post`));

module.exports = myRouter;
