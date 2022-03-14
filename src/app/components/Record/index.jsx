import { Calendar, message } from 'antd';
import dayjs from 'dayjs';
import { get } from 'lodash-es';
import {
  useEffect, useMemo, useRef, useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_NAME, OPERATOR } from '../../constant';
import './index.less';
import { getYearMonthDate } from './utils';

const NOWADAY = dayjs();

export default function Record({ setLoading }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.record);
  const [selectedDate, setSelectedDate] = useState({
    year: NOWADAY.year(),
    month: NOWADAY.month() + 1,
    date: NOWADAY.date(),
    YYYYMMDD: NOWADAY.format('YYYY-MM-DD')
  });
  const currYear = useRef(selectedDate.year);
  const selectedDateDetail = useMemo(() => {
    if (!data.data) return null;
    const { month, date, YYYYMMDD } = selectedDate;
    let ret = get(data, `data[${month}][${date}]`);
    if (!ret) {
      ret = {
        isDate: true,
        date,
        income: 0,
        spending: 0,
        YYYYMMDD,
        data: []
      };
    }
    console.log('selectedDateDetail', ret);
    return ret;
  }, [data, selectedDate]);

  // 请求数据
  const fetchRecord = async (force = false) => {
    if (data.data && !force) return;
    setLoading(true);
    try {
      const { status, data: recordData, error } = await window.electron.GET_STORE_DATA(
        'record_${year}.json',
        `record_${selectedDate.year}.json`,
        true,
        { year: selectedDate.year }
      );
      console.log('fetchRecord', recordData);
      if (!status) {
        dispatch({
          type: ACTION_NAME.SET_RECORD,
          data: recordData
        });
        setLoading(false);
      } else {
        message.error(error);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleAdd = () => {
    console.log('handleAdd');
  };

  // 选择日期
  const handleSelect = (value) => setSelectedDate(getYearMonthDate(value));

  // 日期变化
  const handleChange = (value) => {
    console.log('handleChange', value);
  };

  const dateCellRender = (value) => {
    const { year, month, date } = getYearMonthDate(value);
    if (data.year === year) {
      const ret = get(data, `data[${month}][${date}]`);
      // console.log('ret', ret);
      return ret || null;
    }
    return null;
  };

  const monthCellRender = (value) => {
    const { year, month } = getYearMonthDate(value);
    if (data.year === year) {
      const ret = get(data, `data[${month}]`);
      // console.log('ret', ret);
      return ret || null;
    }
    return null;
  };

  // 初始化操作项
  const handleOperator = () => {
    const operatorData = [
      { ...OPERATOR.ADD, clickEvent: handleAdd }
    ];
    dispatch({
      type: ACTION_NAME.SET_OPERATOR,
      data: operatorData
    });
  };

  useEffect(() => {
    handleOperator();
  }, [handleOperator]);

  useEffect(() => {
    fetchRecord();
  }, []);

  useEffect(() => {
    if (currYear.current !== selectedDate.year) {
      fetchRecord(true);
      currYear.current = selectedDate.year;
    }
    console.log('handleSelect', selectedDate);
  }, [selectedDate]);

  return (
    <div className="ledger-home-content-component">
      <div className="ledger-record ledger-home-component__general">
        <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} onSelect={handleSelect} onChange={handleChange} />
      </div>
    </div>
  );
}
