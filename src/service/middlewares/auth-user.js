'use strict';
const {HttpCode} = require(`../../const`);
const {compare} = require(`../lib/password`);

const ErrorAuthMessage = {
  EMAIL: `Email not found`,
  PASSWORD: `Password is incorrect`,
};

module.exports = (userService) => async (req, res, next) => {
  const {email, password} = req.body;

  const user = await userService.findByEmail(email);

  if (!user) {
    return res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.EMAIL);
  }

  const isPasswordValid = await compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.PASSWORD);
  }

  res.locals.user = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };

  return next();
};
