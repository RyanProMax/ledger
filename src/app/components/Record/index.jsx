import { Calendar, message } from 'antd';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { get } from 'lodash-es';
import {
  useCallback,
  useEffect, useMemo, useRef, useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_NAME, OPERATOR } from '../../constant';
import './index.less';
import { formatDateValue } from './utils';

const NOWADAY = dayjs();

export default function Record({ setLoading }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.record);
  const [selectedDate, setSelectedDate] = useState(NOWADAY.format('YYYY-MM-DD'));
  const [mode, setMode] = useState('month');
  const selectedDateYear = useMemo(() => formatDateValue(dayjs(selectedDate, 'YYYY-MM-DD')).year, [selectedDate]);
  const prevSelectedYear = useRef(selectedDateYear);

  // 请求数据
  const fetchRecord = async (force = false) => {
    if (data.year && !force) return;
    setLoading(true);
    try {
      const { status, data: recordData, error } = await window.electron.GET_STORE_DATA(
        'record_${year}.json',
        `record_${selectedDateYear}.json`,
        true,
        { year: selectedDateYear }
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

  // 选择日期
  const handleSelect = async (newSelectDate) => {
    setSelectedDate(newSelectDate);
    const ret = await window.electron.INIT_SUB_WINDOW({
      windowName: 'detailWindow',
      windowPage: 'record_detail',
      windowConfig: {
        width: 720,
        minWidth: 720
      },
      message: { type: 'data', data, date: newSelectDate }
    });
    if (ret.code) {
      message.error(ret.error);
    }
  };

  const handleAdd = () => handleSelect(dayjs(selectedDate, 'YYYY-MM-DD'));

  const dateCellRender = (value) => {
    const { date, month, formatDate } = formatDateValue(value);
    const dailyData = get(data, `data[${formatDate}]`, []);
    const total = get(data, `statistic[${month}].daily[${formatDate}].total`, 0);
    return (
      <div onClick={() => handleSelect(formatDate)}>
        <div className={classnames('ledger-record__date-cell', {
          'ledger-record__date-cell--negative': dailyData.length && total < 0,
          'ledger-record__date-cell--positive': dailyData.length && total >= 0
        })}
        >
          <div className="ledger-record__date-cell-date">{date}</div>
          {dailyData.length ? (<div className="ledger-record__date-cell-total">{total >= 0 ? `+ ${total}` : `- ${-total}`}</div>) : null}
        </div>
      </div>
    );
  };

  const monthCellRender = (value) => {
    const { month } = formatDateValue(value);
    const total = get(data, `statistic[${month}].total`, 0);
    const hasData = Object.keys(get(data, `statistic[${month}].daily`, {})).length;
    return (
      <div>
        <div className={classnames('ledger-record__month-cell', {
          'ledger-record__month-cell--negative': hasData && total < 0,
          'ledger-record__month-cell--positive': hasData && total >= 0
        })}
        >
          <div className="ledger-record__month-cell-month">{month + 1}</div>
          {hasData ? (<div className="ledger-record__month-cell-total">{total >= 0 ? `+ ${total}` : `- ${-total}`}</div>) : null}
        </div>
      </div>
    );
  };

  // 初始化操作项
  const handleOperator = useCallback(() => {
    if (mode === 'month') {
      const operatorData = [
        { ...OPERATOR.ADD, clickEvent: handleAdd }
      ];
      dispatch({
        type: ACTION_NAME.SET_OPERATOR,
        data: operatorData
      });
    } else {
      dispatch({
        type: ACTION_NAME.SET_OPERATOR,
        data: []
      });
    }
  }, [mode, handleAdd]);

  useEffect(() => {
    handleOperator();
  }, [handleOperator]);

  useEffect(() => {
    fetchRecord();
  }, []);

  useEffect(() => {
    if (prevSelectedYear.current !== selectedDateYear) {
      fetchRecord(true);
      prevSelectedYear.current = selectedDateYear;
    }
  }, [selectedDateYear]);

  useEffect(() => {
    const cb = ({ type }) => {
      switch (type) {
        case 'reload': {
          fetchRecord(true);
          break;
        }
        default: break;
      }
    };
    // receive message from main process
    window.electron.SUBSCRIBE('RECEIVE_MESSAGE', cb);
    // cancel subscribe
    return () => window.electron.UNSUBSCRIBE('RECEIVE_MESSAGE', cb);
  }, [fetchRecord]);

  return (
    <div className="ledger-home-content-component">
      <div className="ledger-record ledger-home-component__general">
        <Calendar onPanelChange={(date, newMode) => setMode(newMode)} dateFullCellRender={dateCellRender} monthFullCellRender={monthCellRender} />
      </div>
    </div>
  );
}
