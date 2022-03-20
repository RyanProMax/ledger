const { v4 } = require('uuid');

class Wallet {
  constructor({
    id, name, balance, type, creditLine
  } = {}) {
    this.id = id || v4();
    this.name = name || '自定义账户';
    this.balance = balance || 0;
    this.type = type || 0;
    this.creditLine = creditLine || 0;
    this.create_time = Date.now();
    this.update_time = Date.now();
  }
}

module.exports = {
  CLASS: Wallet,
  DATA: [
    new Wallet({ name: '余额宝', type: 0, creditLine: 0 }),
    new Wallet({ name: '花呗', type: 1, creditLine: 1000000 }),
    new Wallet({ name: '微信', type: 0, creditLine: 0 }),
    new Wallet({ name: '信用卡', type: 0, creditLine: 0 })
  ]
};
