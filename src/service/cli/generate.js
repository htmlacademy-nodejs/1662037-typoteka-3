'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {ExitCode} = require(`../../const`);
const {getRandomInt, shuffle} = require(`../../utils`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const DEFAULT_COUNT = 1;
const MOCKS_FILE_NAME = `mocks.json`;
const MAX_ANNOUNCE_SENTENCES = 5;
const MAX_FULL_TEXT_SENTENCES = 10;
const MAX_CATEGORIES = 3;
const MAX_DAYS_PERIOD = 90;
const MAX_RECORDS = 1000;

const readFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.info(chalk.red(`Operation failed. Can't read the file...`));
    return [];
  }
};

const getRandomDate = () => {
  const today = new Date();
  return new Date(
      today.setDate(today.getDate() - getRandomInt(0, MAX_DAYS_PERIOD)),
  );
};

const generateMocks = (count, sentences, titles, categories) =>
  Array(count)
    .fill({})
    .map(() => ({
      title: titles[getRandomInt(0, titles.length - 1)],
      createdDate: getRandomDate(),
      announce: shuffle(sentences).slice(
          0,
          getRandomInt(1, MAX_ANNOUNCE_SENTENCES),
      ),
      fullText: shuffle(sentences).slice(
          0,
          getRandomInt(MAX_ANNOUNCE_SENTENCES, MAX_FULL_TEXT_SENTENCES),
      ),
      category: shuffle(categories).slice(0, getRandomInt(1, MAX_CATEGORIES)),
    }));

module.exports = {
  name: `--generate`,
  async run(args) {
    const [param] = args;
    const count = Number.parseInt(param, 10) || DEFAULT_COUNT;
    const sentences = await readFile(FILE_SENTENCES_PATH);
    const titles = await readFile(FILE_TITLES_PATH);
    const categories = await readFile(FILE_CATEGORIES_PATH);

    if (count > MAX_RECORDS) {
      console.info(
          chalk.red(
              `Operation failed. Not more than ${MAX_RECORDS} records allowed.`,
          ),
      );
      process.exit(ExitCode.error);
    }

    const content = JSON.stringify(
        generateMocks(count, sentences, titles, categories),
    );

    try {
      await fs.writeFile(MOCKS_FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
