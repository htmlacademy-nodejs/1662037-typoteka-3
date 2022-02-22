'use strict';

const {Router} = require(`express`);
const upload = require(`../middlewares/upload`);
const checkAuth = require(`../middlewares/check-auth`);
const getUserAuth = require(`../middlewares/get-user-auth`);

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

articlesRouter.get(`/add`, getUserAuth, checkAuth, async (req, res) => {
  const user = res.locals.user || {};
  const categories = await api.getCategories();
  res.render(`admin/post`, {article: {}, categories, user});
});

articlesRouter.get(`/category/:id`, (req, res) => {
  res.send(`/articles/category/:id`);
});

articlesRouter.post(
    `/add`,
    checkAuth,
    upload.single(`upload`),
    async (req, res) => {
      const {body, file} = req;
      const {user} = res.locals;

      console.log();

      const articleData = {
        picture: file ? file.filename : ``,
        title: body.title,
        fullText: body[`full-text`],
        announce: body.announcement,
        categories: assembleCategories(body),
        userId: user.id,
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
    },
);

articlesRouter.get(`/edit/:id`, getUserAuth, async (req, res) => {
  const user = res.locals.user || {};
  const {id} = req.params;
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    return res.render(`admin/post-edit`, {id, article, categories, user});
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

articlesRouter.get(`/articles-by-category`, (req, res) => {
  const user = res.locals.user || {};
  res.render(`articles-by-category`, {user});
});

articlesRouter.get(`/:id`, getUserAuth, async (req, res) => {
  const user = res.locals.user || {};
  const {id} = req.params;

  try {
    const article = await api.getArticle(id);
    return res.render(`post-detail`, {id, article, user});
  } catch (error) {
    return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }
});

articlesRouter.post(`/:id/comments`, checkAuth, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  const {user} = res.locals;

  try {
    await api.createComment(id, {text: comment, userId: user.id});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = errors.response.data;
    const article = await api.getArticle(id);
    res.render(`post-detail`, {article, id, comment, validationMessages});
  }
});

module.exports = articlesRouter;
