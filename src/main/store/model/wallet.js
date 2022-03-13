const { v4 } = require('uuid');

class Wallet {
  constructor({ id, name, balance }) {
    this.id = id || v4();
    this.name = name || '自定义账户';
    this.balance = balance || 0;
  }
}

module.exports = [
  new Wallet({ name: '信用卡' }),
  new Wallet({ name: '支付宝' }),
  new Wallet({ name: '微信' })
];
