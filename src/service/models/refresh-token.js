'use strict';

const {DataTypes, Model} = require(`sequelize`);

class RefreshToken extends Model {}

const define = (sequelize) =>
  RefreshToken.init(
      {
        token: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: `RefreshToken`,
        tableName: `refresh_tokens`,
      },
  );

module.exports = define;
