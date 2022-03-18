import {
  CloseCircleOutlined, CloseOutlined, EditOutlined, PlusOutlined, SaveOutlined
} from '@ant-design/icons';
import {
  Button, Cascader, Col, DatePicker, Empty, Input, InputNumber, message, Radio, Row, Select, Spin
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { v4 } from 'uuid';
import moment from 'moment';
import { cloneDeep } from 'lodash-es';
import SubWindow from '../SubWindow';
import STORE from '../../../global/Store.json';
import './index.less';
import Icon from '../Icon';
import { mergeData } from './utils';

const { TextArea } = Input;
const { Option } = Select;
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
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState([]);
  const [walletData, setWalletData] = useState([]);
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState({});
  const [tempData, setTempData] = useState([]);
  const [currDate, setCurrDate] = useState('');

  const list = useMemo(() => (data[currDate] || null), [data, currDate]);
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
    if (list && list.length) {
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

  const handleChange = (index, newKeyValues) => {
    setTempData((oldData) => {
      const newData = [...oldData];
      newData[index] = { ...newData[index], ...newKeyValues };
      return newData;
    });
  };

  const handleRemove = (index) => {
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
      if (results.every((r) => r)) {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const cb = (newData, date) => {
      setData(newData);
      setCurrDate(date);
    };
    // receive message from main process
    window.electron.SUBSCRIBE('RECEIVE_MESSAGE', cb);
    // cancel subscribe
    return () => window.electron.UNSUBSCRIBE('RECEIVE_MESSAGE', cb);
  }, [setData]);

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
            !editing && (!list || !list.length) && (
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
          {editing && (
            <>
              <Row gutter={[16, 16]} style={{ width: '100%' }}>
                {tempData.map((row, index) => {
                  const defaultDateValue = moment(row.formatDate, 'YYYY-MM-DD');
                  const classValue = [row.className];
                  if (row.subClassName) classValue.push(row.subClassName);

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
                    handleChange(index, {
                      type, className: defaultClass.name || '', subClassName, value
                    });
                  };

                  return (
                    <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }} key={row.id}>
                      <div className="ledger-record-detail__card">
                        <div className="ledger-record-detail__card-form">
                          <span className="ledger-record-detail__card-label">日期</span>
                          <DatePicker defaultValue={defaultDateValue} size="small" format="YYYY-MM-DD" onChange={(momentValue) => handleChange(index, { formatDate: momentValue.format('YYYY-MM-DD') })} />
                          <span className="ledger-record-detail__card-label">收支类型</span>
                          <Radio.Group
                            value={row.type}
                            size="small"
                            onChange={handelChangeType}
                          >
                            <Radio value={0}>收入</Radio>
                            <Radio value={1}>支出</Radio>
                          </Radio.Group>
                          <span className="ledger-record-detail__card-label">分类</span>
                          <Cascader
                            value={classValue}
                            options={getRowClass(row.type)}
                            fieldNames={{
                              label: 'name',
                              value: 'name'
                            }}
                            onChange={(val) => {
                              const [className, subClassName] = val;
                              handleChange(index, {
                                className,
                                subClassName
                              });
                            }}
                            size="small"
                            style={{ width: '100%' }}
                          />
                          <span className="ledger-record-detail__card-label">金额</span>
                          <InputNumber
                            value={row.value}
                            precision={2}
                            controls={false}
                            onChange={(val) => {
                              if ((row.type === 0 && val < 0) || (row.type === 1 && val > 0)) {
                                handleChange(index, { value: -val });
                              } else {
                                handleChange(index, { value: val });
                              }
                            }}
                            size="small"
                            style={{ width: '100%' }}
                          />
                          <span className="ledger-record-detail__card-label">
                            {row.type === 0 ? '收入' : '支出'}
                            账号
                          </span>
                          <Select
                            labelInValue
                            size="small"
                            value={{ value: row.walletId, label: row.walletName }}
                            onChange={(val) => {
                              handleChange(index, {
                                walletId: val.value,
                                walletName: val.label
                              });
                            }}
                          >
                            {walletData.map((c) => (
                              <Option key={c.id} value={c.id}>{c.name}</Option>
                            ))}
                          </Select>
                          <span className="ledger-record-detail__card-label">备注</span>
                          <TextArea
                            value={row.remark}
                            placeholder="备注"
                            maxLength={100}
                            onChange={(e) => handleChange(index, { remark: e.target.value })}
                          />
                        </div>
                        <CloseCircleOutlined className="ledger-record-detail__card-remove" onClick={() => handleRemove(index)} />
                      </div>
                    </Col>
                  );
                })}
              </Row>

              <Button type="dashed" block className="ledger-record-detail__add" onClick={handleAdd}>
                添加
              </Button>
            </>
          )}
        </div>
      </Spin>
    </SubWindow>
  );
}
