'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.render(`admin/my`));
myRouter.get(`/comments`, (req, res) => res.render(`admin/comments`));
myRouter.get(`/post`, (req, res) => res.render(`admin/post`));


module.exports = myRouter;
