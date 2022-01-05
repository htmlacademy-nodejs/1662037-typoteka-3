'use strict';

const fs = require(`fs`).promises;
const {ExitCode} = require(`../../const`);
const {getRandomInt, shuffle} = require(`../../utils`);
const sequelize = require(`../lib/sequelize`);
const initdb = require(`../lib/init-db`);
const {getLogger} = require(`../lib/logger`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const DEFAULT_COUNT = 5;
const MAX_CATEGORIES = 3;
const MAX_ANNOUNCE_SENTENCES = 5;
const MAX_FULL_TEXT_SENTENCES = 10;
const MAX_DAYS_PERIOD = 90;
const MAX_RECORDS = 1000;
const MAX_COMMENTS_COUNT = 3;
const MAX_COMMENT_SENTENCES = 3;

const PictureNames = [`forest@1x.jpg`, `sea-fullsize@1x.jpg`, `sea@1x.jpg`, `skyscraper@1x.jpg`];

const logger = getLogger({name: `api`});

const readFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    logger.info(`Operation failed. Can't read the file...`);
    return [];
  }
};

const getRandomDate = () => {
  const today = new Date();
  return new Date(
      today.setDate(today.getDate() - getRandomInt(0, MAX_DAYS_PERIOD)),
  );
};

const generateComments = (comments) =>
  Array(getRandomInt(0, MAX_COMMENTS_COUNT))
    .fill({})
    .map(() => ({
      text: shuffle(comments)
        .slice(0, getRandomInt(1, MAX_COMMENT_SENTENCES))
        .join(` `),
    }));

const generateCategories = (items) => {
  items = items.slice();
  let count = getRandomInt(1, MAX_CATEGORIES);
  const result = [];
  while (count--) {
    result.push(...items.splice(getRandomInt(0, items.length - 1), 1));
  }
  return result;
};

const generateArticles = (count, sentences, titles, categories, comments) =>
  Array(count)
    .fill({})
    .map(() => ({
      title: titles[getRandomInt(0, titles.length - 1)],
      picture: PictureNames[getRandomInt(0, PictureNames.length - 1)],
      createdDate: getRandomDate(),
      announce: shuffle(sentences)
        .slice(0, getRandomInt(1, MAX_ANNOUNCE_SENTENCES))
        .join(` `),
      fullText: shuffle(sentences)
        .slice(0, getRandomInt(MAX_ANNOUNCE_SENTENCES, MAX_FULL_TEXT_SENTENCES))
        .join(` `),
      categories: generateCategories(categories),
      comments: generateComments(comments),
    }));

module.exports = {
  name: `--filldb`,
  async run(args) {
    const [param] = args;
    const count = Number.parseInt(param, 10) || DEFAULT_COUNT;

    if (count > MAX_RECORDS) {
      logger.info(
          `Operation failed. Not more than ${MAX_RECORDS} records allowed.`,
      );
      process.exit(ExitCode.error);
    }

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const sentences = await readFile(FILE_SENTENCES_PATH);
    const titles = await readFile(FILE_TITLES_PATH);
    const categories = await readFile(FILE_CATEGORIES_PATH);
    const comments = await readFile(FILE_COMMENTS_PATH);

    const articles = generateArticles(count, sentences, titles, categories, comments);

    initdb(sequelize, {categories, articles});
  }
};
