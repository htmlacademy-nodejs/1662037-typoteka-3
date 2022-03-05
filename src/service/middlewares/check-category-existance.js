'use strict';

const {HttpCode} = require(`../../const`);

module.exports = (service) => async (req, res, next) => {
  const {id} = req.params;

  const category = await service.findOne(id);

  if (!category) {
    return res
      .status(HttpCode.NOT_FOUND)
      .send(`Category with id ${id} not found`);
  }

  return next();
};
