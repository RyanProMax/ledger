const { v4 } = require('uuid');

class Wallet {
  constructor({
    id, name, balance, index
  }) {
    this.id = id || v4();
    this.name = name || '自定义账户';
    this.balance = balance || 0;
    this.index = index || 0;
  }
}

module.exports = [
  new Wallet({ name: '支付宝', index: 0 }),
  new Wallet({ name: '微信', index: 1 }),
  new Wallet({ name: '信用卡', index: 2 })
];
