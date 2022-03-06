'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const upload = require(`../middlewares/upload`);
const checkAuth = require(`../middlewares/check-auth`);
const getUserAuth = require(`../middlewares/get-user-auth`);
const checkAdmin = require(`../middlewares/check-admin`);

const {getAPI} = require(`../api`);
const {HttpCode} = require(`../../const`);

const {OFFERS_PER_PAGE} = process.env;

const articlesRouter = new Router();
const api = getAPI();
const csrfProtection = csrf({cookie: {httpOnly: true, sameSite: true}});

const assembleCategories = (formData) => {
  const keys = Object.keys(formData);
  return keys
    .filter((item) => /category/.test(item))
    .map((item) => Number(item.split(`-`).pop()));
};

articlesRouter.get(`/add`, getUserAuth, checkAuth, csrfProtection, async (req, res) => {
  const {user} = res.locals;
  const categories = await api.getCategories();
  res.render(`new-post`, {
    article: {},
    categories,
    user,
    csrfToken: req.csrfToken(),
  });
});

articlesRouter.post(
    `/add`,
    getUserAuth,
    checkAuth,
    upload.single(`upload`),
    csrfProtection,
    async (req, res) => {
      const {body, file} = req;
      const {user} = res.locals;

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
        res.render(`new-post`, {
          article: articleData,
          categories,
          validationMessages,
        });
      }
    },
);

articlesRouter.get(`/edit/:id`, getUserAuth, checkAuth, csrfProtection, async (req, res) => {
  const {user} = res.locals;
  const {id} = req.params;
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories(),
    ]);
    return res.render(`post-edit`, {
      id,
      article,
      categories,
      user,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }
});

articlesRouter.post(
    `/edit/:id`,
    getUserAuth,
    checkAuth,
    upload.single(`upload`),
    csrfProtection,
    async (req, res) => {
      const {body, file} = req;
      const {id} = req.params;
      const {user} = res.locals;

      const articleData = {
        picture: file ? file.filename : body.photo,
        title: body.title,
        fullText: body[`full-text`],
        announce: body.announcement,
        categories: assembleCategories(body),
        userId: user.id,
      };

      try {
        await api.editArticle(id, articleData);
        res.redirect(`/articles/${id}`);
      } catch (errors) {
        const categories = await api.getCategories();
        const validationMessages = errors.response.data;
        res.render(`post-edit`, {
          article: articleData,
          categories,
          validationMessages,
          user
        });
      }
    },
);

articlesRouter.get(`/category/:id`, getUserAuth, async (req, res) => {
  const user = res.locals.user || {};
  const {id} = req.params;
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;

  const offset = (page - 1) * OFFERS_PER_PAGE;
  const [{count, articles}, categories, currentCategory] = await Promise.all([
    api.getArticles({limit, offset, categoryId: id}),
    api.getCategories({count: true}),
    api.getCategory({id}),
  ]);

  if (!currentCategory) {
    res.redirect(`/`);
  }

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
  const withPagination = totalPages > 1;

  res.render(`articles-by-category`, {
    articles,
    page,
    totalPages,
    withPagination,
    categories,
    currentCategory,
    user,
  });
});

articlesRouter.get(`/:id`, getUserAuth, csrfProtection, async (req, res) => {
  const user = res.locals.user || {};
  const {id} = req.params;

  const referer = req.get(`Referrer`);

  const back = referer || `/`;

  try {
    const article = await api.getArticle(id);
    return res.render(`post-detail`, {
      id,
      article,
      user,
      csrfToken: req.csrfToken(),
      back
    });
  } catch (error) {
    return res.status(HttpCode.NOT_FOUND).render(`errors/404`);
  }
});

articlesRouter.post(
    `/:id/comments`,
    getUserAuth,
    checkAuth,
    csrfProtection,
    async (req, res) => {
      const {id} = req.params;
      const {comment} = req.body;
      const {user} = res.locals;

      try {
        await api.createComment(id, {text: comment, userId: user.id});
        res.redirect(`/articles/${id}`);
      } catch (errors) {
        const validationMessages = errors.response.data;
        const article = await api.getArticle(id);
        res.render(`post-detail`, {article, id, comment, validationMessages, user});
      }
    },
);

articlesRouter.post(
    `/:id/comments/delete/:commentId`,
    getUserAuth,
    checkAuth,
    checkAdmin,
    async (req, res) => {
      const {id: articleId, commentId} = req.params;

      try {
        await api.deleteComment({
          articleId,
          commentId,
        });
        res.redirect(`/my/comments`);
      } catch (errors) {
        res.redirect(`/my/comments`);
      }
    },
);

articlesRouter.post(
    `/delete/:id`,
    getUserAuth,
    checkAuth,
    checkAdmin,
    async (req, res) => {
      const {id} = req.params;

      try {
        await api.deleteArticle(id);
        res.redirect(`/my`);
      } catch (errors) {
        res.redirect(`/my`);
      }
    },
);

module.exports = articlesRouter;
