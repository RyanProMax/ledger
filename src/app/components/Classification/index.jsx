import { useEffect, useState } from 'react';
import { message, Table, Space, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './index.less';

const { Column } = Table;

export default () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const { status, data, error } = await window.electron.GET_CLASSIFICATION_DATA();
    if (status === 1) {
      setData(data);
      console.log(data);
    } else {
      console.log(error);
      message.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="ledger-classification">
      <Table
        rowKey="id"
        bordered
        expandable={{ showExpandColumn: false }}
        dataSource={data}
        pagination={false}>
        <Column title="分类" dataIndex="name" key="name" />
        <Column
          title="类型"
          dataIndex="type"
          key="type"
          render={(type) => {
            return <Tag color={type === 0 ? 'green' : 'red'}>{type === 0 ? '收入' : '支出'}</Tag>;
          }}
        />
        <Column
          title="子类"
          dataIndex="children"
          key="children"
          render={(children) => {
            return (
              <>
                {children.length
                  ? children.map((t) => {
                      return (
                        <Tag color="geekblue" key={t.id}>
                          {t.name}
                        </Tag>
                      );
                    })
                  : '-'}
              </>
            );
          }}
        />
        <Column
          title="操作"
          key="action"
          render={(text, record) => <DeleteOutlined className="ledger-classification-remove" />}
        />
      </Table>
    </div>
  );
};
