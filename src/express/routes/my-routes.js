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

myRouter.get(
    `/comments`,
    getUserAuth,
    checkAuth,
    checkAdmin,
    async (req, res) => {
      const {user} = res.locals;

      const articles = await api.getArticles({comments: true});
      const comments = articles.flatMap((article) => article.comments);
      return res.render(`admin/comments`, {articles, comments, user});
    },
);

myRouter.get(`/post`, getUserAuth, checkAuth, checkAdmin, (req, res) => {
  const {user} = res.locals;

  return res.render(`admin/post`, {user});
});

myRouter.get(
    `/categories`,
    getUserAuth,
    checkAuth,
    checkAdmin,
    async (req, res) => {
      const categories = await api.getCategories();
      return res.render(`admin/all-categories`, {categories});
    },
);

myRouter.post(
    `/categories/add`,
    getUserAuth,
    checkAuth,
    checkAdmin,
    async (req, res) => {
      const {name} = req.body;

      try {
        await api.createCategory(name);
        return res.redirect(`/my/categories`);
      } catch (errors) {
        const validationMessages = errors.response.data;
        const categories = await api.getCategories();
        return res.render(`admin/all-categories`, {
          categories,
          validationMessages,
        });
      }
    },
);

myRouter.post(
    `/categories/delete/:id`,
    getUserAuth,
    checkAuth,
    checkAdmin,
    async (req, res) => {
      const {id} = req.params;
      const categories = await api.getCategories();

      try {
        await api.deleteCategory(id);
        return res.redirect(`/my/categories`);
      } catch (errors) {
        const validationMessages = [errors.response.data];
        return res.render(`admin/all-categories`, {
          categories,
          validationMessages,
        });
      }
    },
);

myRouter.post(
    `/categories/update/:id`,
    getUserAuth,
    checkAuth,
    checkAdmin,
    async (req, res) => {
      const {id} = req.params;
      const {name} = req.body;
      const categories = await api.getCategories();

      try {
        await api.updateCategory(id, name);
        return res.redirect(`/my/categories`);
      } catch (errors) {
        const validationMessages = errors.response.data;
        return res.render(`admin/all-categories`, {
          categories,
          validationMessages,
        });
      }
    },
);

module.exports = myRouter;
