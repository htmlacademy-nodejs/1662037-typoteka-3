'use strict';

const {HttpCode} = require(`../../const`);
const Joi = require(`joi`);

const MIN_SYMBOLS = 20;

const ErrorCommentMessage = {
  TEXT: `Comment is less than ${MIN_SYMBOLS} symbols`,
  USER_ID: `User ID is invalid`,
};

const schema = Joi.object({
  text: Joi.string().min(MIN_SYMBOLS).required().messages({
    'string.min': ErrorCommentMessage.TEXT,
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorCommentMessage.USER_ID,
  }),
});

module.exports = (req, res, next) => {
  const comment = req.body;

  const {error} = schema.validate(comment, {abortEarly: false});

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message));
  }

  return next();
};
