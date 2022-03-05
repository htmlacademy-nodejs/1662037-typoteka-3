'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const validateArticle = require(`../middlewares/validate-article`);
const checkArticleExistance = require(`../middlewares/check-article-existance`);
const validateComment = require(`../middlewares/validate-comment`);
const validateRouteParams = require(`../middlewares/route-params-validator`);

module.exports = (app, articleService, commentService) => {
  const router = new Router();
  app.use(`/articles`, router);

  router.get(`/`, async (req, res) => {
    const {comments, limit, offset, categoryId} = req.query;
    let result;

    if (limit || offset) {
      result = await articleService.findPage({limit, offset, categoryId});
    } else {
      result = await articleService.findAll(comments);
    }

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
        checkArticleExistance(articleService)
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
        checkArticleExistance(articleService), validateArticle
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
        .json(`Article with id ${articleId} has been updated`);
      },
  );

  router.delete(
      `/:articleId`,
      [
        validateRouteParams,
        checkArticleExistance(articleService),
      ],
      async (req, res) => {
        const {articleId} = req.params;
        const isDeleted = await articleService.drop(articleId);

        if (!isDeleted) {
          return res
          .status(HttpCode.BAD_REQUEST);
        }

        return res
        .status(HttpCode.OK);
      },
  );

  router.get(
      `/:articleId/comments`,
      [
        validateRouteParams,
        checkArticleExistance(articleService),
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
        checkArticleExistance(articleService),
      ],
      async (req, res) => {
        const {commentId} = req.params;

        const isDeleted = await commentService.drop(commentId);

        if (!isDeleted) {
          return res.sendStatus(HttpCode.NOT_FOUND);
        }

        return res.sendStatus(HttpCode.OK);
      },
  );

  router.post(
      `/:articleId/comments`,
      [
        validateRouteParams,
        checkArticleExistance(articleService), validateComment
      ],
      async (req, res) => {
        const {articleId} = req.params;
        const commentData = req.body;
        const newComment = await commentService.create(articleId, commentData);

        return res.status(HttpCode.CREATED).json(newComment);
      },
  );
};
