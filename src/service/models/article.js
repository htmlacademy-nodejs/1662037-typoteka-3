'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) =>
  Article.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        picture: DataTypes.STRING,
        announce: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fullText: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: `Article`,
        tableName: `articles`,
      },
  );

module.exports = define;
