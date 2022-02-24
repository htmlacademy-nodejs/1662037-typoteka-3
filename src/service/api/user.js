'use strict';

const {Router} = require(`express`);
const {HttpCode, UserRole} = require(`../../const`);
const validateUser = require(`../middlewares/validate-user`);
const authUser = require(`../middlewares/auth-user`);
const {makeTokens, verifyRefreshToken} = require(`../lib/jwt-helper`);
const {hash} = require(`../lib/password`);

module.exports = (app, userService, refreshTokenService) => {
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

  router.post(`/auth`, authUser(userService), async (req, res) => {
    const {user} = res.locals;

    const {accessToken, refreshToken} = makeTokens(user);
    await refreshTokenService.add(refreshToken);

    return res.json({accessToken, refreshToken});
  });

  router.post(`/refresh`, async (req, res) => {
    const {token} = req.body;

    if (!token) {
      return res.sendStatus(HttpCode.BAD_REQUEST);
    }

    const existantToken = await refreshTokenService.find(token);

    if (!existantToken) {
      return res.sendStatus(HttpCode.NOT_FOUND);
    }

    const userInfo = verifyRefreshToken(token);

    if (!userInfo) {
      return res.sendStatus(HttpCode.FORBIDDEN);
    }

    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = makeTokens(userInfo);

    await refreshTokenService.drop(existantToken);
    await refreshTokenService.add(newRefreshToken);

    return res.json({newAccessToken, newRefreshToken});
  });

  router.post(`/logout`, async (req, res) => {
    const {refreshToken} = req.body;

    if (!refreshToken) {
      return res.sendStatus(HttpCode.BAD_REQUEST);
    }

    const existantToken = await refreshTokenService.find(refreshToken);

    if (!existantToken) {
      return res.sendStatus(HttpCode.NOT_FOUND);
    }

    await refreshTokenService.drop(existantToken);

    return res.sendStatus(HttpCode.OK);
  });

  router.post(`/admin`, async (req, res) => {
    const {email} = req.body;

    const user = await userService.findByEmail(email);

    if (!user) {
      return res.sendStatus(HttpCode.NOT_FOUND);
    }

    if (user.role !== UserRole.ADMIN) {
      return res.sendStatus(HttpCode.FORBIDDEN);
    }

    return res.sendStatus(HttpCode.OK);
  });


};

