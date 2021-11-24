'use strict';

const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;
const {HttpCode} = require(`../../const`);

const DEFAULT_PORT = 3000;
const MOCKS_FILENAME = `mocks.json`;

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Page not found.`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(MOCKS_FILENAME, `utf8`);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }
      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [userPort] = args;

    const port = Number.parseInt(userPort, 10) || DEFAULT_PORT;
    http
      .createServer(onClientConnect)
      .listen(port)
      .on(`listening`, () => {
        console.info(chalk.green(`Waiting for connecton on port ${port}`));
      })
      .on(`error`, ({message}) => {
        console.error(chalk.red(`Server launch failed: ${message}`));
      });
  },
};
