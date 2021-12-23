'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  const categories = await api.getCategories();
  res.render(`main`, {articles, categories});
});
mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;

  if (!query) {
    return res.render(`search`, {
      results: [],
      query: ``,
    });
  }

  try {
    const results = await api.search(query);

    return res.render(`search`, {
      results,
      query
    });
  } catch (error) {
    return res.render(`search`, {
      results: [],
      query,
    });
  }
});
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));
mainRouter.get(`/post-detail`, (req, res) => res.render(`post-detail`));

module.exports = mainRouter;
