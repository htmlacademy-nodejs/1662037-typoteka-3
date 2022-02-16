'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const validateUser = require(`../middlewares/validate-user`);
const {hash} = require(`../lib/password`);

module.exports = (app, userService) => {
  const router = new Router();
  app.use(`/user`, router);

  router.post(`/`, validateUser, async (req, res) => {
    const userData = req.body;
    userData.passwordHash = await hash(userData.password);

    const newUser = await userService.create(userData);
    newUser.delete(`passwordHash`);

    return res.status(HttpCode.CREATED).json(newUser);
  });
};

