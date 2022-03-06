/* eslint-disable no-undef */
'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const upload = require(`../middlewares/upload`);
const getUserAuth = require(`../middlewares/get-user-auth`);

const {
  MOST_COMMENTED_ARTICLES_COUNT,
  MAX_ANNOUNCE_LENGTH,
  LATEST_COMMENTS_COUNT,
  MAX_COMMENT_LENGTH,
  OFFERS_PER_PAGE,
  JWT_COOKIE_MAXAGE,
} = process.env;

const mainRouter = new Router();
const api = getAPI();
const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  maxAge: JWT_COOKIE_MAXAGE,
};

mainRouter.get(`/`, getUserAuth, async (req, res) => {
  const user = res.locals.user || {};
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const maxAnnounceLength = MAX_ANNOUNCE_LENGTH;
  const maxCommentLength = MAX_COMMENT_LENGTH;

  const offset = (page - 1) * OFFERS_PER_PAGE;
  const [{count, articles}, categories, mostCommentedAtricles, latestComments] =
    await Promise.all([
      api.getArticles({limit, offset}),
      api.getCategories({count: true}),
      api.getMostCommentedArticles({limit: MOST_COMMENTED_ARTICLES_COUNT}),
      api.getLatestComments({limit: LATEST_COMMENTS_COUNT}),
    ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
  const withPagination = totalPages > 1;

  res.render(`main`, {
    articles,
    mostCommentedAtricles,
    latestComments,
    maxAnnounceLength,
    maxCommentLength,
    page,
    totalPages,
    withPagination,
    categories,
    user,
  });
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
    res.render(`sign-up`, {validationMessages, userData});
  }
});

mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.post(`/login`, async (req, res) => {
  const {email, password} = req.body;
  try {
    const {accessToken, refreshToken} = await api.auth(
        email,
        password,
    );
    res.cookie(`accessToken`, accessToken, cookieOptions);
    res.cookie(`refreshToken`, refreshToken, cookieOptions);

    res.redirect(`/`);
  } catch (errors) {
    const validationMessages = [errors.response.data];

    res.render(`login`, {validationMessages, email});
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
mainRouter.get(`/post-detail`, getUserAuth, (req, res) => res.render(`post-detail`));

module.exports = mainRouter;
