const dayjs = require('dayjs');
const { v4 } = require('uuid');

class Record {
  constructor({ year } = {}) {
    this.id = v4();
    this.year = year || dayjs().year();
    this.total = 0;
    this.income = 0;
    this.spending = 0;
    this.statistic = new Array(12).fill(0).map((_, index) => ({
      month: index + 1,
      total: 0,
      income: 0,
      spending: 0,
      daily: {}
    }));
  }
}

module.exports = {
  CLASS: Record,
  DATA: new Record()
};
