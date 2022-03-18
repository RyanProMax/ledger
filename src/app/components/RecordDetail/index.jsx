import {
  CloseOutlined, EditOutlined, PlusOutlined, SaveOutlined
} from '@ant-design/icons';
import {
  Button, Col, Empty, message, Row, Spin
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { v4 } from 'uuid';
import moment from 'moment';
import { cloneDeep, get } from 'lodash-es';
import SubWindow from '../SubWindow';
import STORE from '../../../global/Store.json';
import './index.less';
import Icon from '../Icon';
import { mergeData } from './utils';
import EditCard from './EditCard';

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

  const list = useMemo(() => get(data, `data[${currDate}]`, []), [data, currDate]);
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

  const handleEdit = () => {
    setEditing(true);
    if (list.length) {
      setTempData(cloneDeep(list));
    }
  };

  const handleCancel = () => {
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
    const newData = mergeData(tempData, data);
    await window.electron.SET_STORE_DATA({
      storeFileName: `record_${newData.year}.json`,
      data: newData
    });
    setData(newData);
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
    const cb = (newData, date) => {
      setData(newData);
      console.log('newData', newData, date);
      setCurrDate(date);
      setLoading(false);
    };
    // receive message from main process
    window.electron.SUBSCRIBE('RECEIVE_MESSAGE', cb);
    // cancel subscribe
    return () => window.electron.UNSUBSCRIBE('RECEIVE_MESSAGE', cb);
  }, [setData]);

  // 编辑页
  const renderEditPage = () => {
    if (!editing) return null;
    return (
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
            <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }} key={row.id}>
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
    );
  };

  return (
    <SubWindow
      windowName="detailWindow"
      renderOperation={(innerClassName) => (
        <>
          {!editing && (
            <Icon className={innerClassName} onClick={handleEdit}>
              <EditOutlined />
            </Icon>
          )}
          {editing && (
            <>
              <Icon className={innerClassName} onClick={handleAdd}>
                <PlusOutlined />
              </Icon>
              <Icon className={innerClassName} onClick={handleSubmit}>
                <SaveOutlined />
              </Icon>
              <Icon className={innerClassName} onClick={handleCancel}>
                <CloseOutlined />
              </Icon>
            </>
          )}
        </>
      )}
    >
      <Spin spinning={loading}>
        <div className="ledger-record-detail">
          {
            !editing && !list.length && (
              <Empty style={{ marginTop: 60 }}>
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={handleEdit}
                >
                  记一笔
                </Button>
              </Empty>
            )
          }
          {renderEditPage()}
        </div>
      </Spin>
    </SubWindow>
  );
}
