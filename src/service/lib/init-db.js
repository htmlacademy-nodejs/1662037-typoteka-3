'use strict';

const defineModels = require(`../models`);
const Alias = require(`../models/alias`);

module.exports = async (sequelize, {categories, articles, users}) => {
  const {Category, Article, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item})),
  );

  const categoryIdByName = categoryModels.reduce(
      (acc, next) => ({
        [next.name]: next.id,
        ...acc,
      }),
      {},
  );

  const userModels = await User.bulkCreate(users, {include: [Alias.ARTICLES, Alias.COMMENTS]});

  const userIdByEmail = userModels.reduce(
      (acc, next) => ({
        [next.email]: next.id,
        ...acc,
      }),
      {},
  );

  articles.forEach((article) => {
    article.userId = userIdByEmail[article.user.email];
    article.comments.forEach((comment) => {
      comment.userId = userIdByEmail[comment.user.email];
    });
  });


  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Alias.COMMENTS]});
    await articleModel.addCategories(
        article.categories.map((name) => categoryIdByName[name]),
    );
  });
  await Promise.all(articlePromises);
};
