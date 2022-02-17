'use strict';

const {Router} = require(`express`);
const {HttpCode, UserRole} = require(`../../const`);
const validateUser = require(`../middlewares/validate-user`);
const {hash} = require(`../lib/password`);

module.exports = (app, userService) => {
  const router = new Router();
  app.use(`/user`, router);

  router.post(`/`, validateUser(userService), async (req, res) => {
    const userData = req.body;
    userData.passwordHash = await hash(userData.password);
    userData.role = UserRole.USER;

    const newUser = await userService.create(userData);
    delete newUser.passwordHash;

    return res.status(HttpCode.CREATED).json(newUser);
  });
};

