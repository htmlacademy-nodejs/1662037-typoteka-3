'use strict';

const jwt = require(`jsonwebtoken`);
const {JWT_ACCESS_SECRET} = process.env;

const verifyAccessToken = (token) => jwt.verify(token, JWT_ACCESS_SECRET, (err, decoded) => {
  if (err) {
    return null;
  }

  delete decoded.iat;
  delete decoded.exp;
  return decoded;
}
);

module.exports = verifyAccessToken;
