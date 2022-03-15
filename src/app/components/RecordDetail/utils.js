import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';

export const mergeData = (list, data) => {
  const toCalculateDate = new Set();
  const ret = cloneDeep(data);
  list.forEach((row) => {
    if (!ret[row.formatDate]) {
      ret[row.formatDate] = [];
    }
    const dateList = ret[row.formatDate];
    const rowIndex = dateList.findIndex((c) => c.id === row.id);
    if (rowIndex === -1) {
      dateList.push(row);
    } else {
      dateList[rowIndex] = row;
    }
    toCalculateDate.add(row.formatDate);
  });
  // statistic
  toCalculateDate.forEach((date) => {
    const monthOfDate = dayjs(date, 'YYYY-MM-DD').month();
    const dateList = ret[date];
    const dateIncome = dateList.filter((d) => d.type === 0).reduce((t, c) => t + c.value, 0);
    const dateSpending = dateList.filter((d) => d.type === 1).reduce((t, c) => t + c.value, 0);
    const currMonth = ret.statistic[monthOfDate];
    const existDailyData = currMonth.daily[date];
    if (existDailyData) {
      currMonth.total -= (existDailyData.total);
      currMonth.income -= existDailyData.income;
      currMonth.spending -= existDailyData.spending;
    }
    currMonth.daily[date] = {
      total: dateIncome + dateSpending,
      income: dateIncome,
      spending: dateSpending
    };
    currMonth.total += (dateIncome + dateSpending);
    currMonth.income += dateIncome;
    currMonth.spending += dateSpending;
  });

  return ret;
};
