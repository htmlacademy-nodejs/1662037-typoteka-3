'use strict';

const {DataTypes, Model} = require(`sequelize`);

class RefreshToken extends Model {}

const define = (sequelize) =>
  RefreshToken.init(
      {
        token: {
          //  eslint-disable-next-line new-cap
          type: DataTypes.STRING(1000),
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
