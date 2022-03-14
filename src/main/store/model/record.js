const dayjs = require('dayjs');
const { v4 } = require('uuid');

class Record {
  constructor({ year } = {}) {
    this.id = v4();
    this.year = year || dayjs().year();
    this.income = 0;
    this.spending = 0;
    this.isYear = true;
    this.data = new Array(12).fill(0).map((_, index) => ({
      month: index + 1,
      isMonth: true,
      income: 0,
      spending: 0,
      data: []
    }));
    this.create_time = Date.now();
    this.update_time = Date.now();
  }
}

module.exports = {
  CLASS: Record,
  DATA: new Record()
};
