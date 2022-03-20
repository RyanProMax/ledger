import {
  CloseOutlined, EditOutlined, MoneyCollectTwoTone, PlusOutlined, RedEnvelopeOutlined, SaveOutlined
} from '@ant-design/icons';
import {
  Button, Col, Empty, message, Row, Spin
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { v4 } from 'uuid';
import moment from 'moment';
import { cloneDeep, get } from 'lodash-es';
import dayjs from 'dayjs';
import classnames from 'classnames';
import SubWindow from '../SubWindow';
import STORE from '../../../global/Store.json';
import './index.less';
import Icon from '../Icon';
import { updateRecordData } from './utils';
import EditCard from './EditCard';
import Divider from '../Divider';
import Ticket from '../Ticket';

const template = ({
  formatDate, className, subClassName, walletId, walletName
} = {}) => ({
  id: v4(),
  formatDate,
  value: 0,
  type: 1,
  className: className || '',
  subClassName: subClassName || '',
  walletId: walletId || '',
  walletName: walletName || '',
  remark: ''
});

export default function RecordDetail() {
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState([]);
  const [walletData, setWalletData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState({});
  const [tempData, setTempData] = useState([]);
  const [currDate, setCurrDate] = useState('');

  const dailyList = useMemo(() => get(data, `data[${currDate}]`, []), [data, currDate]);
  const incomeClassData = useMemo(() => classData.filter((c) => c.type === 0), [classData]);
  const spendingClassData = useMemo(() => classData.filter((c) => c.type === 1), [classData]);
  const getRowClass = (type) => (type === 0 ? incomeClassData : spendingClassData);

  // 请求数据
  const fetchData = async (modelName, storeName, cb = () => { }) => {
    try {
      const { status, data: newData, error } = await window.electron.GET_STORE_DATA(modelName, storeName);
      if (!status) {
        console.log('fetchData', newData);
        cb(newData);
        return true;
      }
      message.error(error);
      return false;
    } catch (e) {
      message.error(e.message);
      return false;
    }
  };

  const handleCancel = () => {
    if (!editing) return;
    setEditing(false);
    setTempData([]);
  };

  const handleAdd = () => {
    const defaultClass = spendingClassData[0] || {};
    let subClassName = '';
    if (defaultClass.children && defaultClass.children.length) {
      subClassName = defaultClass.children[0].name;
    }
    const defaultWallet = walletData[0] || {};
    setTempData((oldData) => [...oldData, template({
      formatDate: currDate,
      className: defaultClass.name,
      subClassName,
      walletId: defaultWallet.id,
      walletName: defaultWallet.name
    })]);
  };

  const handleEdit = () => {
    setEditing(true);
    if (dailyList.length) {
      setTempData(cloneDeep(dailyList));
    } else {
      handleAdd();
    }
  };

  const handleChange = (index) => (newKeyValues) => {
    setTempData((oldData) => {
      const newData = [...oldData];
      newData[index] = { ...newData[index], ...newKeyValues };
      return newData;
    });
  };

  const handleRemove = (index) => () => {
    setTempData((oldData) => {
      const newData = [...oldData];
      newData.splice(index, 1);
      return newData;
    });
  };

  const handleSubmit = async () => {
    if (!tempData.length) {
      message.info('请先添加数据');
      return;
    }
    setLoading(true);
    const newRecordData = updateRecordData(data, tempData, currDate);
    await window.electron.SET_STORE_DATA({
      storeFileName: `record_${newRecordData.year}.json`,
      data: newRecordData
    });
    setData(newRecordData);
    setEditing(false);
    await window.electron.SEND_MESSAGE('mainWindow', { type: 'reload' });
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const results = await Promise.all([
        fetchData(STORE.CLASSIFICATION.FILE_NAME, STORE.CLASSIFICATION.FILE_NAME, setClassData),
        fetchData(STORE.WALLET.FILE_NAME, STORE.WALLET.FILE_NAME, setWalletData)
      ]);
      if (results.every((r) => r) && data.year) {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const cb = ({ type, data: newData, date }) => {
      if (type === 'data') {
        setData(newData);
        setCurrDate(date);
        handleCancel();
        setLoading(false);
      }
    };
    // receive message from main process
    return window.electron.SUBSCRIBE('RECEIVE_MESSAGE', cb);
  }, [handleCancel]);

  // 顶部操作栏
  const rednerTopOperation = (innerClassName) => (
    <>
      {!editing && (
      <Icon tipText="编辑" className={innerClassName} onClick={handleEdit}>
        <EditOutlined />
      </Icon>
      )}
      {editing && (
      <>
        <Icon tipText="添加" className={innerClassName} onClick={handleAdd}>
          <PlusOutlined />
        </Icon>
        <Icon tipText="保存" className={innerClassName} onClick={handleSubmit}>
          <SaveOutlined />
        </Icon>
        <Icon tipText="取消" className={innerClassName} onClick={handleCancel}>
          <CloseOutlined />
        </Icon>
      </>
      )}
    </>
  );

  // 空页面
  const renderEmpty = () => (
    <Empty style={{ marginTop: 60 }}>
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={handleEdit}
      >
        记一笔
      </Button>
    </Empty>
  );

  // 主页面
  const renderMain = () => {
    const dayjsDate = dayjs(currDate, 'YYYY-MM-DD');
    const month = dayjsDate.month() + 1;
    const date = dayjsDate.date();
    const total = get(data, `statistic[${month - 1}].daily[${currDate}].total`, 0).toFixed(2);
    const isPositive = total >= 0;
    const incomeList = dailyList.filter((x) => x.type === 0);
    const spendingList = dailyList.filter((x) => x.type === 1);

    return (
      <div className="ledger-record-detail__main">
        <div className="ledger-record-detail__title">
          <div className="ledger-record-detail__date">
            <span className="ledger-record-detail__date--number">{month}</span>
            <span className="ledger-record-detail__date--word">月</span>
            <span className="ledger-record-detail__date--number">{date}</span>
            <span className="ledger-record-detail__date--word">日</span>
          </div>
          <MoneyCollectTwoTone className="ledger-record-detail__logo" twoToneColor={isPositive ? '#ff7875' : '#a0d911'} />
          <div className={classnames('ledger-record-detail__total', {
            'ledger-record-detail__total--positive': isPositive,
            'ledger-record-detail__total--negative': !isPositive
          })}
          >
            ￥
            {' '}
            {Math.abs(total)}
          </div>
        </div>
        {incomeList.length ? (
          <>
            <Divider dashed orientation="left" className="ledger-record-detail__divider" style={{ color: '#ff4d4f', borderColor: '#ffccc7' }}>
              <RedEnvelopeOutlined style={{ marginRight: '8px' }} />
              收入明细
            </Divider>
            <Row style={{ width: '100%' }}>
              {dailyList.filter((r) => r.type === 0).map((r) => {
                const row = { ...r, classNameText: r.className };
                delete row.className;
                return (
                  <Col key={r.id} span={8}>
                    <Ticket
                      {...row}
                      color="#ff4d4f"
                      borderColor="#ffccc7"
                      dashed
                      className="ledger-record-detail__ticket"
                    />
                  </Col>
                );
              })}
            </Row>
          </>
        ) : null}
        {spendingList.length ? (
          <>
            <Divider dashed orientation="left" className="ledger-record-detail__divider" style={{ color: '#52c41a', borderColor: '#b7eb8f' }}>
              <RedEnvelopeOutlined style={{ marginRight: '8px' }} />
              支出明细
            </Divider>
            <Row style={{ width: '100%' }}>
              {dailyList.filter((r) => r.type === 1).map((r) => {
                const row = { ...r, classNameText: r.className };
                delete row.className;
                return (
                  <Col key={r.id} span={8}>
                    <Ticket
                      {...row}
                      color="#52c41a"
                      borderColor="#b7eb8f"
                      dashed
                      className="ledger-record-detail__ticket"
                    />
                  </Col>
                );
              })}
            </Row>
          </>
        ) : null}
      </div>
    );
  };

  // 编辑页
  const renderEditPage = () => (
    <div className="ledger-record-detail__edit">
      <div className="ledger-record-detail__tips">
        <span>注意：</span>
        <span>{`1. 当前设置页日期为：【${currDate}】`}</span>
        <span>2. 如设置其它日期，该笔记录将被【新增】至对应日期的记录下</span>
        <span>3. 如需切换当前设置页日期，请返回主窗口重新选择</span>
      </div>
      <Row gutter={[16, 16]} style={{ width: '100%' }}>
        {tempData.map((row, index) => {
          const defaultDateValue = moment(row.formatDate, 'YYYY-MM-DD');
          const classValue = [row.className];
          if (row.subClassName) classValue.push(row.subClassName);

          const indexHandleChange = handleChange(index);
          const indexHandleRemove = handleRemove(index);

          const handelChangeType = (e) => {
            const type = e.target.value;
            const defaultClass = getRowClass(type)[0] || {};
            let subClassName = '';
            let { value } = row;
            if (defaultClass.children && defaultClass.children.length) {
              subClassName = defaultClass.children[0].name;
            }
            if ((type === 0 && value < 0) || (type === 1 && value > 0)) {
              value = -value;
            }
            indexHandleChange({
              type, className: defaultClass.name || '', subClassName, value
            });
          };

          return (
            <Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }} key={row.id}>
              <EditCard
                defaultDateValue={defaultDateValue}
                type={row.type}
                classValue={classValue}
                classOptions={getRowClass(row.type)}
                value={row.value}
                walletId={row.walletId}
                walletName={row.walletName}
                walletOptions={walletData}
                remark={row.remark}
                handleChange={indexHandleChange}
                handleRemove={indexHandleRemove}
                handelChangeType={handelChangeType}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );

  // 渲染控制
  const renderControl = () => {
    if (editing) {
      return renderEditPage();
    }
    if (!dailyList.length) {
      return renderEmpty();
    }
    return renderMain();
  };

  return (
    <Spin spinning={loading}>
      <SubWindow windowName="detailWindow" renderOperation={rednerTopOperation}>
        <div className="ledger-record-detail">
          {renderControl()}
        </div>
      </SubWindow>
    </Spin>
  );
}
