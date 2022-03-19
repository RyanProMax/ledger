import { Col, message, Row } from 'antd';
import dayjs from 'dayjs';
import {
  useEffect, useMemo, useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash-es';
import { ACTION_NAME } from '../../constant';
import './index.less';
import MonthBarGraph from './MonthBarGraph';
import MonthPieGraph from './MonthPieGraph';
import YearBarGraph from './YearBarGraph';
import { getMonthClassificationStatistic, getMonthDailyStatistic } from './utils';

export default function Record({ setLoading }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.record);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const selectedYear = useMemo(() => selectedDate.year(), [selectedDate]);
  const monthBarStatistic = useMemo(() => getMonthDailyStatistic(data, selectedDate), [data, selectedDate]);
  const monthPieStatistic = useMemo(() => getMonthClassificationStatistic(data, selectedDate), [data, selectedDate]);
  const yearBarStatistic = useMemo(() => get(data, 'statistic', []).map((r) => ({ ...r, formatDate: `${selectedYear}-${r.month}` })), [data]);

  // 请求数据
  const fetchRecord = async (force = false) => {
    if (data.year && !force) return;
    setLoading(true);
    try {
      const { status, data: recordData, error } = await window.electron.GET_STORE_DATA(
        'record_${year}.json',
        `record_${selectedYear}.json`,
        true,
        { year: selectedYear }
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

  // 初始化操作项
  const handleOperator = () => {
    dispatch({
      type: ACTION_NAME.SET_OPERATOR,
      data: []
    });
  };

  useEffect(() => {
    handleOperator();
  }, [handleOperator]);

  useEffect(() => {
    fetchRecord();
  }, []);

  return (
    <div className="ledger-home-content-component">
      <div className="ledger-dashboard">
        <Row gutter={[32, 32]}>
          <Col span={12}>
            <MonthBarGraph data={monthBarStatistic} />
          </Col>
          <Col span={12}>
            <MonthPieGraph data={monthPieStatistic} />
          </Col>
          <Col span={24}>
            <YearBarGraph data={yearBarStatistic} />
          </Col>
        </Row>
      </div>
    </div>
  );
}
