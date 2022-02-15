'use strict';

const {Model} = require(`sequelize`);
const defineArticle = require(`./article`);
const defineCategory = require(`./category`);
const defineComment = require(`./comments`);
const Alias = require(`./alias`);

const define = (sequelize) => {
  const Article = defineArticle(sequelize);
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);

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

  return {Article, Category, Comment, ArticleCategory};
};

module.exports = define;
