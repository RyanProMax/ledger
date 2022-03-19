import dayjs from 'dayjs';
import { get } from 'lodash-es';

export const getMonthDailyStatistic = (data, date) => {
  const startDate = date.startOf('month');
  const monthDays = date.daysInMonth();
  const [year, month] = [date.year(), date.month()];
  const statistic = get(data, `statistic[${month}].daily`, {});

  const ret = [];

  for (let i = 0; i < monthDays; i++) {
    const currDate = startDate.add(i, 'day');
    const currFormatDate = currDate.format('YYYY-MM-DD');
    const dailyStatistic = get(statistic, currFormatDate, { total: 0, income: 0, spending: 0 });
    ret.push({
      ...dailyStatistic,
      year,
      month: month + 1,
      date: currDate.date(),
      formatDate: currFormatDate
    });
  }

  return ret;
};

export const getMonthClassificationStatistic = (data, date) => {
  const startDate = date.startOf('month');
  const monthDays = date.daysInMonth();
  const dailyList = get(data, 'data', {});

  const ret = [];

  for (let i = 0; i < monthDays; i++) {
    const currDate = startDate.add(i, 'day');
    const currFormatDate = currDate.format('YYYY-MM-DD');
    ret.push(...get(dailyList, `[${currFormatDate}]`, []));
  }

  return ret;
};
