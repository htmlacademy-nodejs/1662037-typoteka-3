'use strict';

const pino = require(`pino`);
const {Env} = require(`../../const`);

const LOG_FILE_PATH = `./logs/api.log`;
const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
const defaultLogLevel = isDevMode ? `info` : `error`;

const logger = pino(
    {
      name: `basic-logger`,
      level: process.env.LOG_LEVEL || defaultLogLevel,
      transport: isDevMode
        ? {
          target: `pino-pretty`,
        }
        : ``,
    },
    isDevMode ? process.stdout : pino.destination(LOG_FILE_PATH),
);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  },
};
