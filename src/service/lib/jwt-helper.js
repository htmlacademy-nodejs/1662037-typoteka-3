'use strict';

const jwt = require(`jsonwebtoken`);
const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET} = process.env;

const makeTokens = (tokenData) => {
  console.log(tokenData);
  const accessToken = jwt.sign(tokenData, JWT_ACCESS_SECRET, {
    expiresIn: `25s`,
  });
  const refreshToken = jwt.sign(tokenData, JWT_REFRESH_SECRET);
  console.log(`accessToken`, accessToken, `refreshToken`, refreshToken);
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
