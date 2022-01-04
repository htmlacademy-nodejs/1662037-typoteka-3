'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const validateArticle = require(`../middlewares/validate-article`);
const checkArticleExistance = require(`../middlewares/check-article-existance`);
const validateComment = require(`../middlewares/validate-comment`);

module.exports = (app, articleService, commentService) => {
  const router = new Router();
  app.use(`/articles`, router);
  router.get(`/`, async (req, res) => {
    const {comments} = req.query;
    const articles = await articleService.findAll(comments);

    return res.status(HttpCode.OK).json(articles);
  });

  router.get(
      `/:articleId`,
      checkArticleExistance(articleService),
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
      [checkArticleExistance(articleService), validateArticle],
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
      checkArticleExistance(articleService),
      async (req, res) => {
        const {articleId} = req.params;
        const isDeleted = await articleService.drop(articleId);

        if (!isDeleted) {
          return res
          .status(HttpCode.BAD_REQUEST)
          .send(`Article hasn't been deleted`);
        }

        return res
        .status(HttpCode.OK)
        .json(`Article with id ${articleId} has been deleted`);
      },
  );

  router.get(
      `/:articleId/comments`,
      checkArticleExistance(articleService),
      async (req, res) => {
        const {articleId} = req.params;

        const comments = await commentService.findAll(articleId);

        return res.status(HttpCode.OK).json(comments);
      },
  );

  router.delete(
      `/:articleId/comments/:commentId`,
      checkArticleExistance(articleService),
      async (req, res) => {
        const {commentId} = req.params;

        const isDeleted = await commentService.drop(commentId);

        if (!isDeleted) {
          return res
          .status(HttpCode.NOT_FOUND)
          .send(`Comment with id ${commentId} not found`);
        }

        return res
        .status(HttpCode.OK)
        .json(`Comment with id ${commentId} has been deleted`);
      },
  );

  router.post(
      `/:articleId/comments`,
      [checkArticleExistance(articleService), validateComment],
      async (req, res) => {
        const {articleId} = req.params;
        const commentData = req.body;
        const newComment = await commentService.create(articleId, commentData);

        return res.status(HttpCode.CREATED).json(newComment);
      },
  );
};
