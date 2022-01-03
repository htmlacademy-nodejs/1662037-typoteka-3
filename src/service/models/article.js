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
          //  eslint-disable-next-line new-cap
          type: DataTypes.STRING(1000),
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
