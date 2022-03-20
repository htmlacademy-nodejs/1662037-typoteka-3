'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../const`);
const validateArticle = require(`../../middlewares/validate-article`);
const checkArticleExistence = require(`../../middlewares/check-article-existence`);
const validateComment = require(`../../middlewares/validate-comment`);
const validateRouteParams = require(`../../middlewares/route-params-validator`);

const {
  MOST_COMMENTED_ARTICLES_COUNT,
  LATEST_COMMENTS_COUNT,
} = process.env;


module.exports = (app, articleService, commentService) => {
  const router = new Router();

  const updateHotSectionData = async (req) => {
    const [latestComments, latestArticles] = await Promise.all([
      commentService.findLatest(LATEST_COMMENTS_COUNT),
      articleService.findMostCommented(MOST_COMMENTED_ARTICLES_COUNT),
    ]);

    if (!latestComments || !latestArticles) {
      return;
    }

    const io = req.app.locals.socketio;

    if (io) {
      io.emit(`updateHotSection`, {latestComments, latestArticles});
    }
  };

  app.use(`/articles`, router);

  router.get(`/`, async (req, res) => {
    const {comments, limit, offset, categoryId} = req.query;
    let result;

    result = limit || offset
      ? await articleService.findPage({limit, offset, categoryId})
      : await articleService.findAll(comments);

    return res.status(HttpCode.OK).json(result);
  });

  router.get(`/most_commented`, async (req, res) => {
    const {limit} = req.query;
    const articles = await articleService.findMostCommented(limit);

    if (!articles) {
      return res.send([]);
    }

    return res.status(HttpCode.OK).json(articles);
  });

  router.get(`/latest_comments`, async (req, res) => {
    const {limit} = req.query;
    const comments = await commentService.findLatest(limit);

    if (!comments) {
      return res.send([]);
    }

    return res.status(HttpCode.OK).json(comments);
  });

  router.get(
      `/:articleId`,
      [
        validateRouteParams,
        checkArticleExistence(articleService)
      ],
      async (req, res) => {
        const article = res.locals.article;

        return res.status(HttpCode.OK).json(article);
      },
  );

  router.post(`/`, validateArticle, async (req, res) => {
    const newArticle = await articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(newArticle);
  });

  router.put(
      `/:articleId`,
      [
        validateRouteParams,
        checkArticleExistence(articleService), validateArticle
      ],
      async (req, res) => {
        const newData = req.body;
        const {articleId} = req.params;

        const isUpdated = await articleService.update(articleId, newData);

        if (!isUpdated) {
          return res
          .status(HttpCode.BAD_REQUEST)
          .send(`Article hasn't been updated`);
        }

        return res
        .status(HttpCode.OK)
        .send(`Article with id ${articleId} has been updated`);
      },
  );

  router.delete(
      `/:articleId`,
      [
        validateRouteParams,
        checkArticleExistence(articleService),
      ],
      async (req, res) => {
        const {articleId} = req.params;
        const isDeleted = await articleService.drop(articleId);

        if (!isDeleted) {
          return res
          .sendStatus(HttpCode.BAD_REQUEST);
        }

        await updateHotSectionData(req);

        return res
        .sendStatus(HttpCode.OK);
      },
  );

  router.get(
      `/:articleId/comments`,
      [
        validateRouteParams,
        checkArticleExistence(articleService),
      ],
      async (req, res) => {
        const {articleId} = req.params;

        const comments = await commentService.findAll(articleId);

        return res.status(HttpCode.OK).json(comments);
      },
  );

  router.delete(
      `/:articleId/comments/:commentId`,
      [
        validateRouteParams,
        checkArticleExistence(articleService),
      ],
      async (req, res) => {
        const {commentId} = req.params;

        const isDeleted = await commentService.drop(commentId);

        if (!isDeleted) {
          return res.sendStatus(HttpCode.NOT_FOUND);
        }

        await updateHotSectionData(req);

        return res.sendStatus(HttpCode.OK);
      },
  );

  router.post(
      `/:articleId/comments`,
      [
        validateRouteParams,
        checkArticleExistence(articleService), validateComment
      ],
      async (req, res) => {
        const {articleId} = req.params;
        const commentData = req.body;

        const newComment = await commentService.create(articleId, commentData);

        await updateHotSectionData(req);

        return res.status(HttpCode.CREATED).json(newComment);
      },
  );
};
