import {
  message, Table, Tag
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './index.less';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ACTION_NAME } from '../../store/constant';
import STORE_NAME from '../../../global/StoreName.json';

const { Column } = Table;

export default function Classification() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.classification);
  console.log('Classification', data);

  const fetchClassification = async () => {
    const { status, data: newData, error } = await window.electron.GET_STORE_DATA(STORE_NAME.CLASSIFICATION);
    if (!status) {
      dispatch({
        type: ACTION_NAME.SET_CLASSIFICATION,
        data: newData
      });
    } else {
      message.error(error);
    }
  };

  useEffect(() => {
    fetchClassification();
  }, []);

  return (
    <div className="ledger-classification">
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
          render={(type) => <Tag color={type === 0 ? 'green' : 'red'}>{type === 0 ? '收入' : '支出'}</Tag>}
        />
        <Column
          title="子类"
          dataIndex="children"
          key="children"
          render={(children) => (children.length
            ? children.map((t) => (
              <Tag color="geekblue" key={t.id}>
                {t.name}
              </Tag>
            ))
            : '-')}
        />
        <Column
          title="操作"
          key="action"
          render={(text, record) => <DeleteOutlined className="ledger-classification-remove" />}
        />
      </Table>
    </div>
  );
}
