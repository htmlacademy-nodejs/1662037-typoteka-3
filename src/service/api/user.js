'use strict';

const {Router} = require(`express`);
const {HttpCode, UserRole} = require(`../../const`);
const validateUser = require(`../middlewares/validate-user`);
const {hash, compare} = require(`../lib/password`);

const ErrorAuthMessage = {
  EMAIL: `Email not found`,
  PASSWORD: `Password is incorrect`,
};

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

  router.post(`/auth`, async (req, res) => {
    const {email, password} = req.body;

    const user = await userService.findByEmail(email);

    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.EMAIL);
    }

    const isPasswordValid = await compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(HttpCode.UNAUTHORIZED).send(ErrorAuthMessage.PASSWORD);
    }

    delete user.passwordHash;
    return res.status(HttpCode.OK).json(user);
  });


};

