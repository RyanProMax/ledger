import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';

export const updateStatistic = (data, dateList) => {
  const newStatistic = cloneDeep(data.statistic);
  dateList.forEach((date) => {
    const monthOfDate = dayjs(date, 'YYYY-MM-DD').month();
    const dailyListOfCurrDate = data.data[date];
    const dateIncome = dailyListOfCurrDate.filter((d) => d.type === 0).reduce((t, c) => t + c.value, 0);
    const dateSpending = dailyListOfCurrDate.filter((d) => d.type === 1).reduce((t, c) => t + c.value, 0);
    const currMonth = newStatistic[monthOfDate];
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

  return newStatistic;
};

export const updateRecordData = (data, list, defaultDate) => {
  const newRecordData = cloneDeep(data);
  const toCalculateStatisticDate = new Set();

  // 直接将 list 中与 defaultDate 日期一致的数据迁移过去，同步修改记录（增删改）
  newRecordData.data[defaultDate] = list.filter((c) => c.formatDate === defaultDate);
  toCalculateStatisticDate.add(defaultDate);

  // 与 defaultDate 日期不一致的记录，进行覆盖 or 新增
  list.filter((c) => c.formatDate !== defaultDate).forEach((row) => {
    const currDate = row.formatDate;
    if (!newRecordData.data[currDate]) {
      newRecordData.data[currDate] = [row];
    } else {
      const dailyListOfCurrDate = newRecordData.data[currDate];
      const rowIndex = dailyListOfCurrDate.findIndex((c) => c.id === row.id);
      if (rowIndex > -1) {
        dailyListOfCurrDate[rowIndex] = row;
      } else {
        dailyListOfCurrDate.push(row);
      }
    }
    toCalculateStatisticDate.add(currDate);
  });
  // statistic
  newRecordData.statistic = updateStatistic(newRecordData, toCalculateStatisticDate);

  return newRecordData;
};
