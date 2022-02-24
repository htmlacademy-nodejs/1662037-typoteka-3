'use strict';

const {getAPI} = require(`../api`);

module.exports = async (req, res, next) => {
  const {email} = res.locals.user;

  const api = getAPI();

  try {
    await api.checkAdmin(email);
    return next();
  } catch (_err) {
    return res.redirect(`/`);
  }
};
