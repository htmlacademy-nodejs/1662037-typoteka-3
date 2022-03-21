'use strict';

const {Model} = require(`sequelize`);
const defineArticle = require(`./article`);
const defineCategory = require(`./category`);
const defineComment = require(`./comments`);
const defineUser = require(`./user`);
const defineRefreshToken = require(`./refresh-token`);
const Alias = require(`./alias`);

const define = (sequelize) => {
  const Article = defineArticle(sequelize);
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const User = defineUser(sequelize);
  const RefreshToken = defineRefreshToken(sequelize);

  class ArticleCategory extends Model {}
  ArticleCategory.init({}, {sequelize});

  Article.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `cascade`,
  });

  Comment.belongsTo(Article, {as: Alias.ARTICLES, foreignKey: `articleId`});

  Article.belongsToMany(Category, {through: ArticleCategory, as: Alias.CATEGORIES, foreignKey: `articleId`});
  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: Alias.ARTICLES,
    foreignKey: `categoryId`,
  });
  Category.hasMany(ArticleCategory, {
    as: Alias.ARTICLE_CATEGORIES,
    foreignKey: `categoryId`
  });
  Article.hasMany(ArticleCategory, {
    as: Alias.ARTICLE_CATEGORIES,
    foreignKey: `articleId`,
  });

  User.hasMany(Article, {as: Alias.ARTICLES, foreignKey: `userId`});
  Article.belongsTo(User, {as: Alias.USERS, foreignKey: `userId`});

  User.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Alias.USERS, foreignKey: `userId`});

  return {Article, Category, Comment, ArticleCategory, User, RefreshToken};
};

module.exports = define;
