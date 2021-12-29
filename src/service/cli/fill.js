'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {ExitCode} = require(`../../const`);
const {getRandomInt, shuffle} = require(`../../utils`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const DEFAULT_COUNT = 1;
const MOCKS_FILE_NAME = `fill_db.sql`;
const MAX_ANNOUNCE_SENTENCES = 5;
const MAX_FULL_TEXT_SENTENCES = 10;
const MAX_RECORDS = 1000;
const MAX_COMMENTS_COUNT = 3;
const MAX_COMMENT_SENTENCES = 3;

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`,
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`,
  },
];

const readFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.info(chalk.red(`Operation failed. Can't read the file...`));
    return [];
  }
};

const generateComments = (comments, userCount, articleId) =>
  Array(getRandomInt(0, MAX_COMMENTS_COUNT))
    .fill({})
    .map(() => ({
      text: shuffle(comments)
        .slice(0, getRandomInt(1, MAX_COMMENT_SENTENCES))
        .join(` `),
      userId: getRandomInt(1, userCount),
      articleId,
    }));

const generateMocks = (
    count,
    sentences,
    titles,
    categoryCount,
    comments,
    userCount,
) =>
  Array(count)
    .fill({})
    .map((_, index) => ({
      title: titles[getRandomInt(0, titles.length - 1)],
      picture: `image${index + 1}.jpg`,
      announce: shuffle(sentences)
        .slice(0, getRandomInt(1, MAX_ANNOUNCE_SENTENCES))
        .join(` `),
      fullText: shuffle(sentences)
        .slice(0, getRandomInt(MAX_ANNOUNCE_SENTENCES, MAX_FULL_TEXT_SENTENCES))
        .join(` `),
      category: [getRandomInt(1, categoryCount)],
      comments: generateComments(comments, userCount, index + 1),
      userId: getRandomInt(1, userCount),
    }));

module.exports = {
  name: `--fill`,
  async run(args) {
    const [param] = args;
    const count = Number.parseInt(param, 10) || DEFAULT_COUNT;
    const sentences = await readFile(FILE_SENTENCES_PATH);
    const titles = await readFile(FILE_TITLES_PATH);
    const categories = await readFile(FILE_CATEGORIES_PATH);
    const commentSentences = await readFile(FILE_COMMENTS_PATH);

    if (count > MAX_RECORDS) {
      console.info(
          chalk.red(
              `Operation failed. Not more than ${MAX_RECORDS} records allowed.`,
          ),
      );
      process.exit(ExitCode.error);
    }

    const articles = generateMocks(
        count,
        sentences,
        titles,
        categories.length,
        commentSentences,
        users.length,
    );

    const comments = articles.flatMap((article) => article.comments);

    const articleCategories = articles.map((article, index) => ({
      articleId: index + 1,
      categoryId: article.category[0],
    }));

    const userValues = users
      .map(
          ({email, passwordHash, firstName, lastName, avatar}) =>
            `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`,
      )
      .join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles
      .map(
          (article) =>
            `('${article.title}', '${article.picture}', '${article.announce}', '${article.fullText}', ${article.userId})`,
      )
      .join(`,\n`);

    const articleCategoriesValues = articleCategories
      .map((item) => `(${item.articleId}, ${item.categoryId})`)
      .join(`,\n`);

    const commentValues = comments
      .map(
          (comment) =>
            `('${comment.text}', ${comment.userId}, ${comment.articleId})`,
      )
      .join(`,\n`);

    const content = `
-- ADD users
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};

-- ADD categories
INSERT INTO categories(name) VALUES
${categoryValues};

-- ADD articles
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, picture, announce, full_text, user_id) VALUES
${articleValues};
ALTER TABLE articles ENABLE TRIGGER ALL;


-- ADD article_categories
ALTER TABLE article_categories DISABLE TRIGGER ALL;
INSERT INTO article_categories(article_id, category_id) VALUES
${articleCategoriesValues};
ALTER TABLE article_categories ENABLE TRIGGER ALL;


-- ADD comments
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text, user_id, article_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL; `;

    try {
      await fs.writeFile(MOCKS_FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
