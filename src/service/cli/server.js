'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const {HttpCode} = require(`../../const`);
const apiRoter = require(`../api`);

const DEFAULT_PORT = 3000;
const API_PREFIX = `/api`;

module.exports = {
  name: `--server`,
  run(args) {
    const app = express();
    app.use(express.json());

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.use(API_PREFIX, apiRoter);

    app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));

    app.listen(port);
    console.info(chalk.green(`Server is running on port ${port}`));
  },
};
