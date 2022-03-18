import { Calendar, message } from 'antd';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { get } from 'lodash-es';
import {
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
  const handleSelect = async (value) => {
    const newSelectDate = value.format('YYYY-MM-DD');
    setSelectedDate(newSelectDate);
    const ret = await window.electron.INIT_SUB_WINDOW('detailWindow', 'record_detail', data, newSelectDate);
    if (ret.code) {
      message.error(ret.error);
    }
  };

  const handleAdd = () => handleSelect(dayjs(selectedDate, 'YYYY-MM-DD'));

  const dateCellRender = (value) => {
    const { date, month, formatDate } = formatDateValue(value);
    let total = null;
    if (data.data && data.data[formatDate]) {
      total = get(data, `statistic[${month}].daily[${formatDate}].total`, null);
    }
    return (
      <div style={{ padding: '0 2px' }}>
        <div className={classnames('ledger-record__date-cell', {
          'ledger-record__date-cell--negative': total < 0,
          'ledger-record__date-cell--positive': total !== null && total >= 0
        })}
        >
          <div className="ledger-record__date-cell-date">{date}</div>
          {total !== null && (<div className="ledger-record__date-cell-total">{total >= 0 ? `+ ${total}` : `- ${-total}`}</div>)}
        </div>
      </div>
    );
  };

  const monthCellRender = (value) => {
    const { year, month } = formatDateValue(value);
    if (data.year === year) {
      const ret = get(data, `data[${month - 1}]`);
      return ret && ret.data.length ? ret.income - ret.spending : null;
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
        <Calendar dateFullCellRender={dateCellRender} monthCellRender={monthCellRender} onSelect={handleSelect} />
      </div>
    </div>
  );
}
