'use strict';

const {Router} = require(`express`);
const upload = require(`../middlewares/upload`);
const {getAPI} = require(`../api`);
const {ensureArray} = require(`../../utils`);
const {HttpCode} = require(`../../const`);

const articlesRouter = new Router();
const api = getAPI();

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`admin/post`, {article: {}, categories});
});

articlesRouter.get(`/category/:id`, (req, res) => {
  res.send(`/articles/category/:id`);
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const articleData = {
    picture: file ? file.filename : ``,
    createdDate: body.date,
    title: body.title,
    fullText: body[`full-text`],
    announce: body.announcement,
    category: ensureArray(body.category),
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    return res.render(`admin/post`, {article, categories});
  } catch (error) {
    return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }

});

articlesRouter.get(`/articles-by-category`, (req, res) =>
  res.render(`articles-by-category`),
);

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const article = await api.getArticle(id);
    return res.render(`post-detail`, {article});
  } catch (error) {
    return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }
});

module.exports = articlesRouter;
