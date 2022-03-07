'use strict';

const {HttpCode} = require(`../../const`);
const Joi = require(`joi`);

const MIN_SYMBOLS = 5;
const MAX_SYMBOLS = 30;

const ErrorCategoryMessage = {
  NAME_MIN: `Name is less than ${MIN_SYMBOLS} symbols`,
  NAME_MAX: `Name is longer than ${MAX_SYMBOLS} symbols`,
  CATEGORY_EXIST: `Category with such a name already exists`,
};

const schema = Joi.object({
  name: Joi.string().min(MIN_SYMBOLS).max(MAX_SYMBOLS).required().messages({
    'string.min': ErrorCategoryMessage.NAME_MIN,
    'string.max': ErrorCategoryMessage.NAME_MAX,
  }),
});

module.exports = (service) => async (req, res, next) => {
  const newCategory = req.body;

  const {error} = schema.validate(newCategory, {abortEarly: false});

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message));
  }

  const category = await service.findByName(newCategory.name);

  if (category) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send([ErrorCategoryMessage.CATEGORY_EXIST]);
  }

  return next();
};
