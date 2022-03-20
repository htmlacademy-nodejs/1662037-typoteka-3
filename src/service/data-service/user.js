'use strict';

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async findByEmail(email) {
    const user = await this._User.findOne({where: {email}});
    return user && user.get();
  }

  async create(data) {
    const user = await this._User.create(data);
    return user.get();
  }
}

module.exports = UserService;
