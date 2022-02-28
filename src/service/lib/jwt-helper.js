'use strict';

const jwt = require(`jsonwebtoken`);
const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_TOKEN_EXPIRE_TIME} =
  process.env;

const makeTokens = (tokenData) => {
  const accessToken = jwt.sign(tokenData, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_TOKEN_EXPIRE_TIME,
  });
  const refreshToken = jwt.sign(tokenData, JWT_REFRESH_SECRET);
  return {accessToken, refreshToken};
};

const verifyRefreshToken = (token) => jwt.verify(token, JWT_REFRESH_SECRET, (err, decoded) => {
  if (err) {
    return null;
  }

  delete decoded.iat;
  return decoded;
}
);

module.exports = {makeTokens, verifyRefreshToken};
