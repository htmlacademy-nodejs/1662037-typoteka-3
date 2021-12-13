'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const validateArticle = require(`../middlewares/validate-article`);
const checkArticleExistance = require(`../middlewares/check-article-existance`);
const validateComment = require(`../middlewares/validate-comment`);

const router = new Router();

module.exports = (app, service) => {
  app.use(`/articles`, router);

  router.get(`/`, async (req, res) => {
    const articles = await service.findAll();

    return res.status(HttpCode.OK).json(articles);
  });

  router.get(`/:articleId`, checkArticleExistance(service), async (req, res) => {
    const article = res.locals.article;

    return res.status(HttpCode.OK).json(article);
  });

  router.post(`/`, validateArticle, async (req, res) => {
    const newArticle = await service.create(req.body);

    return res.status(HttpCode.CREATED).json(newArticle);
  });

  router.put(`/:articleId`, [checkArticleExistance(service), validateArticle], async (req, res) => {
    const oldArticle = res.locals.article;
    const newArticle = req.body;

    const updatedArticle = await service.update(oldArticle, newArticle);

    return res.status(HttpCode.OK).json(updatedArticle);
  });

  router.delete(`/:articleId`, checkArticleExistance(service), async (req, res) => {
    const article = res.locals.article;
    const deletedItem = await service.delete(article);

    return res
      .status(HttpCode.OK)
      .json(deletedItem);
  });

  router.get(`/:articleId/comments`, checkArticleExistance(service), async (req, res) => {
    const article = res.locals.article;

    return res.status(HttpCode.OK).json(article.comments);
  });

  router.delete(
      `/:articleId/comments/:commentId`,
      checkArticleExistance(service),
      async (req, res) => {
        const article = res.locals.article;
        const {commentId} = req.params;

        const deletedComment = await service.deleteComment(article, commentId);

        if (!deletedComment) {
          return res.status(HttpCode.NOT_FOUND).send(`Comment with id ${commentId} not found`);
        }

        return res.status(HttpCode.OK).json(`Comment with id ${deletedComment.id} has been deleted`);
      }
  );

  router.post(`/:articleId/comments`, [checkArticleExistance(service), validateComment], async (req, res) => {
    const article = res.locals.article;
    const comment = req.body;
    const newComment = await service.postComment(article, comment);

    return res.status(HttpCode.CREATED).json(newComment);
  });
};
