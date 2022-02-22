'use strict';

const {getAPI} = require(`../api`);
const verifyAccessToken = require(`../lib/jwt-helper`);

module.exports = async (req, res, next) => {
  let user = null;
  const api = getAPI();

  const cookieOptions = {httpOnly: true, sameSite: true};
  const {accessToken, refreshToken} = req.cookies;

  if (!accessToken && !refreshToken) {
    return next();
  }

  user = verifyAccessToken(accessToken);

  if (user === null) {
    try {
      const {newAccessToken, newRefreshToken} = await api.refresh(refreshToken);
      res.cookie(`accessToken`, newAccessToken, cookieOptions);
      res.cookie(`refreshToken`, newRefreshToken, cookieOptions);

      user = verifyAccessToken(newAccessToken);
    } catch (_err) {
      return next();
    }
  }

  res.locals.user = user;
  return next();
};
