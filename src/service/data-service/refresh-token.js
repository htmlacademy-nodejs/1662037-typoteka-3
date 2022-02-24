'use strict';

class RefreshTokenService {
  constructor(sequelize) {
    this._RefreshToken = sequelize.models.RefreshToken;
  }

  async add(token) {
    const refreshToken = await this._RefreshToken.create({token});
    return refreshToken.get();
  }

  async find(token) {
    const refreshToken = await this._RefreshToken.findOne({where: {token}});
    return refreshToken && refreshToken.get().token;
  }

  async drop(token) {
    const deletedRowsCount = await this._RefreshToken.destroy({where: {token}});

    return !!deletedRowsCount;
  }
}

module.exports = RefreshTokenService;
