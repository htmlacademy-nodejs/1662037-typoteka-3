/* eslint-disable no-undef */
'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const upload = require(`../middlewares/upload`);
const getUserAuth = require(`../middlewares/get-user-auth`);

const OFFERS_PER_PAGE = 8;

const mainRouter = new Router();
const api = getAPI();
const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  maxAge: 1000 * 60 * 60 * 24,
};

mainRouter.get(`/`, getUserAuth, async (req, res) => {
  const user = res.locals.user || {};
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;

  const offset = (page - 1) * OFFERS_PER_PAGE;
  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({limit, offset}),
    api.getCategories({count: true}),
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main`, {articles, page, totalPages, categories, user});
});

mainRouter.get(`/register`, getUserAuth, async (req, res) => {
  const {user} = res.locals;

  if (user) {
    return res.redirect(`/`);
  }

  return res.render(`sign-up`);
});

mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    name: body.name,
    surname: body.surname,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = errors.response.data;
    res.render(`sign-up`, {validationMessages});
  }
});

mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.post(`/login`, async (req, res) => {
  try {
    const {accessToken, refreshToken} = await api.auth(
        req.body.email,
        req.body.password,
    );
    res.cookie(`accessToken`, accessToken, cookieOptions);
    res.cookie(`refreshToken`, refreshToken, cookieOptions);

    res.redirect(`/`);
  } catch (errors) {
    const validationMessages = [errors.response.data];

    res.render(`login`, {validationMessages});
  }
});

mainRouter.get(`/logout`, async (req, res) => {
  const {refreshToken} = req.cookies;

  try {
    await api.logout(refreshToken);
  // eslint-disable-next-line no-empty
  } catch (_err) {
  } finally {
    res.clearCookie(`accessToken`);
    res.clearCookie(`refreshToken`);
    res.redirect(`/`);
  }
});

mainRouter.get(`/search`, getUserAuth, async (req, res) => {
  const user = res.locals.user || {};
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
      query,
      user
    });
  } catch (error) {
    return res.render(`search`, {
      results: [],
      query,
      user
    });
  }
});
mainRouter.get(`/categories`, getUserAuth, (req, res) => res.render(`all-categories`));
mainRouter.get(`/post-detail`, getUserAuth, (req, res) => res.render(`post-detail`));

module.exports = mainRouter;
