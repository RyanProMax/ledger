import dayjs from 'dayjs';
import { cloneDeep, differenceBy, get } from 'lodash-es';
import STORE from '../../../global/Store.json';

/**
 * @description 更新统计数据
 */
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

/**
 * @param oldRecordData 旧 record 数据
 * @param list 新数据列表
 * @param defaultDate 编辑日期
 *
 * @description 更新 record 数据
 * 规则：
 *  1. 与编辑日期一致的数据，进行 diff 比对 -> 计算新增/修改/删除数据 -> 更新对应账号余额
 *  2. 非编辑日期的数据，进行新增 or 修改 -> 更新对应账号余额
 */
export const updateRecordData = async (oldRecordData, list, defaultDate) => {
  try {
    const { data: newWalletData, error } = await window.electron.GET_STORE_DATA(STORE.WALLET.FILE_NAME, STORE.WALLET.FILE_NAME);
    if (error) {
      return {
        status: true,
        error
      };
    }
    const newRecordData = cloneDeep(oldRecordData);
    const toCalculateStatisticDate = new Set();

    // 处理 list 中与 defaultDate 日期一致的数据（增删改）
    toCalculateStatisticDate.add(defaultDate);
    const newDefaultDateList = list.filter((c) => c.formatDate === defaultDate);
    const oldDefaultDateList = get(oldRecordData, `data[${defaultDate}]`, []);
    const decreasedDateList = differenceBy(oldDefaultDateList, newDefaultDateList, (r) => r.id);
    // 处理删除数据 -> 余额
    decreasedDateList.forEach((row) => {
      const wallet = newWalletData.find((w) => w.id === row.walletId);
      wallet.balance -= row.value;
    });
    // 处理新增/修改数据
    newDefaultDateList.forEach((row) => {
      const wallet = newWalletData.find((w) => w.id === row.walletId);
      const oldData = oldDefaultDateList.find((o) => o.id === row.id);
      // 修改
      if (oldData) {
        wallet.balance += (row.value - oldData.value);
      } else {
        // 新增
        wallet.balance += row.value;
      }
    });
    // 覆盖
    newRecordData.data[defaultDate] = newDefaultDateList;

    // 与 defaultDate 日期不一致的记录，进行覆盖 or 新增
    list.filter((c) => c.formatDate !== defaultDate).forEach((row) => {
      const wallet = newWalletData.find((w) => w.id === row.walletId);
      const currDate = row.formatDate;
      // 新增
      if (!newRecordData.data[currDate]) {
        newRecordData.data[currDate] = [row];
        wallet.balance += row.value;
      } else {
        const dailyListOfCurrDate = newRecordData.data[currDate];
        const rowIndex = dailyListOfCurrDate.findIndex((c) => c.id === row.id);
        if (rowIndex > -1) {
          // 编辑
          wallet.balance += (row.value - dailyListOfCurrDate[rowIndex].value);
          dailyListOfCurrDate[rowIndex] = row;
        } else {
          // 新增
          dailyListOfCurrDate.push(row);
          wallet.balance += row.value;
        }
      }
      toCalculateStatisticDate.add(currDate);
    });
    // statistic
    newRecordData.statistic = updateStatistic(newRecordData, toCalculateStatisticDate);
    // save wallet Data
    await window.electron.SET_STORE_DATA({ storeFileName: STORE.WALLET.FILE_NAME, data: newWalletData });

    return {
      status: true,
      data: newRecordData
    };
  } catch (e) {
    return {
      status: false,
      error: e.message
    };
  }
};
