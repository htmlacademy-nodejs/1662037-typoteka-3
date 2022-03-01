'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const checkAuth = require(`../middlewares/check-auth`);
const getUserAuth = require(`../middlewares/get-user-auth`);
const checkAdmin = require(`../middlewares/check-admin`);

const myRouter = new Router();
const api = getAPI();

myRouter.get(`/`, getUserAuth, checkAuth, checkAdmin, async (req, res) => {
  const {user} = res.locals;
  const articles = await api.getArticles();
  res.render(`admin/my`, {articles, user});
});
myRouter.get(`/comments`, getUserAuth, checkAuth, checkAdmin, async (req, res) => {
  const {user} = res.locals;

  const articles = await api.getArticles({comments: true});
  const comments = articles.flatMap((article) => article.comments);
  res.render(`admin/comments`, {articles, comments, user});
});
myRouter.get(`/post`, getUserAuth, checkAuth, checkAdmin, (req, res) => {
  const {user} = res.locals;

  res.render(`admin/post`, {user});
});

module.exports = myRouter;
