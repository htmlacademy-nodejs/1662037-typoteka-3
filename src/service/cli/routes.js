'use strict';

const {Router} = require(`express`);
const fs = require(`fs`).promises;

const FILENAME = `mocks.json`;

const backServerRouter = new Router();

backServerRouter.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILENAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.send([]);
  }
});

module.exports = backServerRouter;
