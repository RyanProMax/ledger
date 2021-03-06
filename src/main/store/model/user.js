const { v4 } = require('uuid');

class User {
  constructor({
    id, nickName, realName, sex, birthDay
  } = {}) {
    this.id = id || v4();
    this.nickName = nickName || '';
    this.realName = realName || '';
    this.sex = sex || -1;
    this.birthDay = birthDay || Date.now();
    this.create_time = Date.now();
    this.update_time = Date.now();
  }
}

module.exports = {
  CLASS: User,
  DATA: new User()
};
