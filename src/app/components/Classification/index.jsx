import {
  Input, message, Popconfirm, Select, Table, Tag
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import './index.less';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash-es';
import { v4 } from 'uuid';
import { ACTION_NAME, OPERATOR } from '../../constant';
import STORE_NAME from '../../../global/StoreName.json';

const { Column } = Table;

export default function Classification({ setLoading }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.classification);
  const [editting, setEditting] = useState(false);
  const [tempData, setTempData] = useState([]);
  const [inputVisible, setInputVisible] = useState({});

  // 请求数据
  const fetchClassification = async (force = false) => {
    if (data.length && !force) return;
    setLoading(true);
    try {
      const { status, data: classData, error } = await window.electron.GET_STORE_DATA(STORE_NAME.CLASSIFICATION);
      if (!status) {
        dispatch({
          type: ACTION_NAME.SET_CLASSIFICATION,
          data: classData
        });
        console.log('fetchClassification', classData);
        setLoading(false);
      } else {
        message.error(error);
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  const handleAdd = () => {
    setTempData((oldData) => [...oldData, {
      id: v4(), name: '新分类', type: 1, children: []
    }]);
  };

  const handleEdit = () => {
    setEditting(true);
    setTempData(cloneDeep(data));
  };

  const handleCancel = () => {
    setEditting(false);
    setTempData([]);
  };

  const handleRemove = (index) => async () => {
    setTempData((oldData) => {
      const newData = [...oldData];
      newData.splice(index, 1);
      return newData;
    });
  };

  const handleSubmit = async () => {
    if (tempData.every((row) => row.name.trim())) {
      setLoading(true);
      await window.electron.SET_STORE_DATA({
        storeName: STORE_NAME.CLASSIFICATION,
        data: tempData
      });
      await fetchClassification(true);
      handleCancel();
    } else {
      message.warn('数据不符合要求，请修改');
    }
  };

  const handleSubmitTag = (index) => () => {
    const value = inputVisible[index].value.trim();
    if (value) {
      setTempData((oldData) => {
        const newData = [...oldData];
        newData[index].children.push({ id: v4(), name: value });
        return newData;
      });
    }
    setInputVisible((oldVal) => {
      const newVal = { ...oldVal, [index]: null };
      return newVal;
    });
  };

  // 初始化操作项
  const handleOperator = () => {
    if (!editting) {
      const operatorData = [
        { ...OPERATOR.EDIT, clickEvent: handleEdit }
      ];
      dispatch({
        type: ACTION_NAME.SET_OPERATOR,
        data: operatorData
      });
    } else {
      const operatorData = [
        { ...OPERATOR.ADD, clickEvent: handleAdd },
        { ...OPERATOR.FINISH, clickEvent: handleSubmit },
        { ...OPERATOR.CANCEL, clickEvent: handleCancel }
      ];
      dispatch({
        type: ACTION_NAME.SET_OPERATOR,
        data: operatorData
      });
    }
  };

  useEffect(() => {
    handleOperator();
  }, [handleOperator]);

  useEffect(() => {
    fetchClassification();
  }, []);

  return (
    <div className="ledger-classification ledger-home-content-component">
      <Table
        rowKey="id"
        bordered
        expandable={{ showExpandColumn: false }}
        dataSource={editting ? tempData : data}
        pagination={false}
      >
        <Column
          title="分类"
          dataIndex="name"
          key="name"
          render={(name, record, index) => (editting ? (
            <Input
              value={name}
              status={!name ? 'error' : ''}
              placeholder="分类名不能为空"
              onChange={(e) => {
                setTempData((oldData) => {
                  const newData = [...oldData];
                  newData[index].name = e.target.value;
                  return newData;
                });
              }}
              size="small"
            />
          ) : name)}
        />
        <Column
          title="类型"
          dataIndex="type"
          key="type"
          render={(type, record, index) => (editting ? (
            <Select
              defaultValue={type}
              options={[{ label: '收入', value: 0 }, { label: '支出', value: 1 }]}
              onChange={(e) => {
                setTempData((oldData) => {
                  const newData = [...oldData];
                  newData[index].type = e;
                  return newData;
                });
              }}
              size="small"
            />
          ) : <Tag color={type === 0 ? 'green' : 'red'}>{type === 0 ? '收入' : '支出'}</Tag>)}
        />
        <Column
          title="子类"
          dataIndex="children"
          key="children"
          render={(children, record, index) => {
            if (!children.length && !editting) { return '-'; }
            return (
              <>
                {children.map((t, i) => (
                  <Tag
                    key={t.id}
                    color="geekblue"
                    closable={editting}
                    onClose={(e) => {
                      e.preventDefault();
                      setTempData((oldData) => {
                        const newData = [...oldData];
                        newData[index].children.splice(i, 1);
                        return newData;
                      });
                    }}
                  >
                    {t.name}
                  </Tag>
                ))}
                {editting && (
                  inputVisible[index] && inputVisible[index].isInput ? (
                    <Input
                      type="text"
                      size="small"
                      style={{ width: 78 }}
                      value={inputVisible[index].value}
                      onChange={(e) => {
                        setInputVisible((oldVal) => ({
                          ...oldVal,
                          [index]: {
                            isInput: true,
                            value: e.target.value
                          }
                        }));
                      }}
                      onBlur={handleSubmitTag(index)}
                      onPressEnter={handleSubmitTag(index)}
                    />
                  )
                    : (
                      <Tag
                        onClick={() => setInputVisible((oldVal) => ({ ...oldVal, [index]: { isInput: true, value: '' } }))}
                        color="orange"
                        style={{
                          background: '#fff',
                          borderStyle: 'dashed'
                        }}
                      >
                        <PlusOutlined />
                        {' '}
                        新子类
                      </Tag>
                    )
                )}
              </>
            );
          }}
        />
        {editting && (
          <Column
            title="操作"
            key="action"
            render={(text, record, index) => (
              <Popconfirm
                title="确认是否删除该分类？"
                placement="left"
                onConfirm={handleRemove(index)}
                okText="确认"
                cancelText="取消"
              >
                <DeleteOutlined className="ledger-classification-remove" />
              </Popconfirm>
            )}
          />
        )}
      </Table>
    </div>
  );
}
