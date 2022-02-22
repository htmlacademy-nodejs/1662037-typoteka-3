'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const checkAuth = require(`../middlewares/check-auth`);
const getUserAuth = require(`../middlewares/get-user-auth`);

const myRouter = new Router();
const api = getAPI();

myRouter.get(`/`, getUserAuth, checkAuth, async (req, res) => {
  const user = res.locals.user || {};
  const articles = await api.getArticles();
  res.render(`admin/my`, {articles, user});
});
myRouter.get(`/comments`, getUserAuth, checkAuth, async (req, res) => {
  const user = res.locals.user || {};
  const articles = await api.getArticles({comments: true});
  const comments = articles.flatMap((article) => article.comments);
  res.render(`admin/comments`, {comments, user});
});
myRouter.get(`/post`, getUserAuth, checkAuth, (req, res) => {
  const user = res.locals.user || {};
  res.render(`admin/post`, {user});
});

module.exports = myRouter;
