'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const OFFERS_PER_PAGE = 8;

const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;

  const offset = (page - 1) * OFFERS_PER_PAGE;
  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({limit, offset}),
    api.getCategories({count: true}),
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main`, {articles, page, totalPages, categories});
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
