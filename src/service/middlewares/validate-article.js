'use strict';

const {HttpCode} = require(`../../const`);
const Joi = require(`joi`);

const MIN_SYMBOLS = 30;
const MAX_SYMBOLS = 250;
const MAX_FULL_DESCRIPTION = 1000;

const ErrorArticleMessage = {
  CATEGORIES: `At least 1 category should be chosed`,
  TITLE_MIN: `Title is less than ${MIN_SYMBOLS} symbols`,
  TITLE_MAX: `Title is longer than ${MAX_SYMBOLS} symbols`,
  TITLE_EMPTY: `Title is not allowed to be empty`,
  ANNOUNCE_MIN: `Announce is less than ${MIN_SYMBOLS} symbols`,
  ANNOUNCE_MAX: `Announce is longer than ${MAX_SYMBOLS} symbols`,
  ANNOUNCE_EMPTY: `Announce is not allowed to be empty`,
  FULL_TEXT_MAX: `Full text is longer that ${MAX_FULL_DESCRIPTION} symbols`,
  USER_ID: `User ID is invalid`,
};

const schema = Joi.object({
  title: Joi.string().min(MIN_SYMBOLS).max(MAX_SYMBOLS).required().messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX,
    'string.empty': ErrorArticleMessage.TITLE_EMPTY,
  }),
  announce: Joi.string().min(MIN_SYMBOLS).max(MAX_SYMBOLS).required().messages({
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX,
    'string.empty': ErrorArticleMessage.ANNOUNCE_EMPTY,
  }),
  fullText: Joi.string().max(MAX_FULL_DESCRIPTION).optional().allow(``).messages({
    'string.max': ErrorArticleMessage.FULL_TEXT_MAX,
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
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorArticleMessage.USER_ID,
  }),
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
