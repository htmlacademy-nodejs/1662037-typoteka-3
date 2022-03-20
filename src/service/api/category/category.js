'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../const`);
const validateCategoryName = require(`../../middlewares/validate-category-name`);
const checkCategoryIsEmpty = require(`../../middlewares/check-category-is-empty`);
const checkCategoryExistance = require(`../../middlewares/check-category-existance`);


module.exports = (app, service) => {
  const router = new Router();
  app.use(`/categories`, router);

  router.get(`/`, async (req, res) => {
    const {count} = req.query;

    const categories = await service.findAll(count);
    return res.status(HttpCode.OK).json(categories);
  });

  router.get(`/:id`, async (req, res) => {
    const {id} = req.params;

    const category = await service.findOne(id);
    return res.status(HttpCode.OK).json(category);
  });

  router.post(`/add`, validateCategoryName(service), async (req, res) => {
    const {name} = req.body;

    const category = await service.create(name);
    return res.status(HttpCode.OK).json(category);
  });

  router.delete(
      `/:id`,
      checkCategoryExistance(service),
      checkCategoryIsEmpty(service),
      async (req, res) => {
        const {id} = req.params;

        const isDeleted = await service.drop(id);

        if (!isDeleted) {
          return res.sendStatus(HttpCode.NOT_FOUND);
        }

        return res.sendStatus(HttpCode.OK);
      },
  );

  router.put(
      `/:id`,
      checkCategoryExistance(service),
      validateCategoryName(service),
      async (req, res) => {
        const {id} = req.params;
        const {name} = req.body;

        const isUpdated = await service.update(id, name);

        if (!isUpdated) {
          return res
            .sendStatus(HttpCode.BAD_REQUEST)
            .send(`Category hasn't been updated`);
        }

        return res
          .status(HttpCode.OK)
          .send(`Category with id ${id} has been updated`);
      },
  );
};
