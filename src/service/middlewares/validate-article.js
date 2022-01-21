'use strict';

const {HttpCode} = require(`../../const`);
const Joi = require(`joi`);

const ErrorArticleMessage = {
  CATEGORIES: `At least 1 category should be chosed`,
  TITLE_MIN: `Title is less than 30 symbols`,
  TITLE_MAX: `Title is longer than 250 symbols`,
  TITLE_EMPTY: `Title is not allowed to be empty`,
  ANNOUNCE_MIN: `Announce is less than 30 symbols`,
  ANNOUNCE_MAX: `Announce is longer than 250 symbols`,
  ANNOUNCE_EMPTY: `Announce is not allowed to be empty`,
  FULL_TEXT_MAX: `Full text is longer that 1000 symbols`,
  FULL_TEXT_EMPTY: `Full text is not allowed to be empty`,
};

const schema = Joi.object({
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX,
    'string.empty': ErrorArticleMessage.TITLE_EMPTY,
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX,
    'string.empty': ErrorArticleMessage.ANNOUNCE_EMPTY,
  }),
  fullText: Joi.string().max(1000).required().messages({
    'string.max': ErrorArticleMessage.FULL_TEXT_MAX,
    'string.empty': ErrorArticleMessage.FULL_TEXT_EMPTY,
  }),
  categories: Joi.array()
    .items(
        Joi.number().integer().positive().messages({
          'number.base': ErrorArticleMessage.CATEGORIES,
        }),
    )
    .min(1)
    .required(),
  picture: Joi.string().allow(null).allow(``).optional(),
});

module.exports = (req, res, next) => {
  const newArticle = req.body;

  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message));
  }

  return next();
};
