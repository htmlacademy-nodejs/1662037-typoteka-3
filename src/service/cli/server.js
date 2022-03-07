'use strict';

const express = require(`express`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const http = require(`http`);
const socketio = require(`../lib/socket`);

const {HttpCode} = require(`../../const`);
const apiRouter = require(`../api`);

const DEFAULT_PORT = 3000;
const API_PREFIX = `/api`;

module.exports = {
  name: `--server`,
  async run(args) {
    const logger = getLogger({name: `api`});
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const app = express();
    const server = http.createServer(app);

    const io = socketio(server);

    io.on(`connection`, (socket) => {
      const {address: ip} = socket.handshake;
      console.log(`Новое подключение: ${ip}`);
    });

    app.locals.socketio = io;

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.use(express.json());

    app.use((req, res, next) => {
      logger.debug(`Request on route ${req.url}`);
      res.on(`finish`, () => {
        logger.info(`Response status code ${res.statusCode}`);
      });
      return next();
    });

    app.use(API_PREFIX, apiRouter);

    app.use((req, res) => {
      logger.error(`Route not found: ${req.url}`);
      return res.status(HttpCode.NOT_FOUND).send(`Not found`);
    });

    app.use((err, _req, _res, _next) => {
      logger.error(`An error occurred on processing request: ${err.message}`);
    });

    try {
      server.listen(port, (err) => {
        if (err) {
          return logger.error(
              `An error occurred on server creation: ${err.message}`,
          );
        }

        return logger.info(`Listening to connections on ${port}`);
      });
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
  },
};
