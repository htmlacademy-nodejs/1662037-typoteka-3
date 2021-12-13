'use strict';

const {HttpCode} = require(`../../const`);

module.exports = (req, res, next) => {
  const comment = req.body;

  if (
    !comment.text ||
    comment.text.length === 0 ||
    Object.keys(comment).length > 1
  ) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(`Bad request. Not a valid comment.`);
  }

  return next();
};
