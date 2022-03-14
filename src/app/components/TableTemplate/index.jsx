import {
  message, Popconfirm, Table, Tag
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './index.less';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ACTION_NAME, OPERATOR } from '../../constant';
import STORE from '../../../global/Store.json';

const { Column } = Table;

export default function Classification({ setLoading }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.classification);

  // 请求数据
  const fetchClassification = async (force = false) => {
    if (data.length && !force) return;
    setLoading(true);
    try {
      const { status, data: classData, error } = await window.electron.GET_STORE_DATA(STORE.CLASSIFICATION.FILE_NAME, STORE.CLASSIFICATION.FILE_NAME);
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

  const handleEdit = () => {
    console.log('handleEdit');
  };

  // 初始化操作项
  const handleOperator = () => {
    const operatorData = [
      { ...OPERATOR.EDIT, clickEvent: handleEdit }
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
    fetchClassification();
  }, []);

  return (
    <div className="ledger-classification ledger-home-content-component">
      <Table
        rowKey="id"
        bordered
        expandable={{ showExpandColumn: false }}
        dataSource={data}
        pagination={false}
      >
        <Column title="分类" dataIndex="name" key="name" />
        <Column
          title="类型"
          dataIndex="type"
          key="type"
          render={(type, record, index) => (<Tag color={type === 0 ? 'green' : 'red'}>{type === 0 ? '收入' : '支出'}</Tag>)}
        />
        <Column
          title="子类"
          dataIndex="children"
          key="children"
          render={(children, record, index) => {
            if (!children.length) { return '-'; }
            return (
              <>
                {children.map((t, i) => (
                  <Tag
                    key={t.id}
                    color="geekblue"
                  >
                    {t.name}
                  </Tag>
                ))}
              </>
            );
          }}
        />
        <Column
          title="操作"
          key="action"
          render={(text, record, index) => (
            <Popconfirm
              title="确认是否删除该分类？"
              placement="left"
              okText="确认"
              cancelText="取消"
            >
              <DeleteOutlined className="ledger-classification-remove" />
            </Popconfirm>
          )}
        />
      </Table>
    </div>
  );
}
