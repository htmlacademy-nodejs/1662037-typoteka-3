'use strict';

const {Router} = require(`express`);
const upload = require(`../middlewares/upload`);
const {getAPI} = require(`../api`);
const {HttpCode} = require(`../../const`);

const articlesRouter = new Router();
const api = getAPI();

const assembleCategories = (formData) => {
  const keys = Object.keys(formData);
  return keys
    .filter((item) => /category/.test(item))
    .map((item) => Number(item.split(`-`).pop()));
};


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
    title: body.title,
    fullText: body[`full-text`],
    announce: body.announcement,
    categories: assembleCategories(body),
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const categories = await api.getCategories();
    const validationMessages = errors.response.data;
    res.render(`admin/post`, {
      article: articleData,
      categories,
      validationMessages,
    });
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    return res.render(`admin/post-edit`, {id, article, categories});
  } catch (error) {
    return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    picture: file ? file.filename : body.photo,
    title: body.title,
    fullText: body[`full-text`],
    announce: body.announcement,
    categories: assembleCategories(body),
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const categories = await api.getCategories();
    const validationMessages = errors.response.data;
    res.render(`admin/post-edit`, {
      article: articleData,
      categories,
      validationMessages,
    });
  }
});

articlesRouter.get(`/articles-by-category`, (req, res) =>
  res.render(`articles-by-category`),
);

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;

  try {
    const article = await api.getArticle(id);
    return res.render(`post-detail`, {id, article});
  } catch (error) {
    return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = errors.response.data;
    const article = await api.getArticle(id);
    res.render(`post-detail`, {article, id, comment, validationMessages});
  }
});

module.exports = articlesRouter;
