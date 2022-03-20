import {
  Input,
  InputNumber,
  message, Popconfirm, Select, Table, Tag
} from 'antd';
import { DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import './index.less';
import { useDispatch, useSelector } from 'react-redux';
import {
  useCallback, useEffect, useMemo, useState
} from 'react';
import { v4 } from 'uuid';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { round } from 'lodash-es';
import { ACTION_NAME, OPERATOR } from '../../constant';
import STORE from '../../../global/Store.json';

const { Column } = Table;

// sortable item
const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

export default function Wallet({ setLoading }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.wallet);
  const [editing, setEditing] = useState(false);
  const [tempData, setTempData] = useState([]);
  const sortData = useMemo(() => data.map((row, index) => ({ ...row, index })), [data]);

  // 请求数据
  const fetchWallet = async () => {
    setLoading(true);
    try {
      const { data: walletData, error } = await window.electron.GET_STORE_DATA(STORE.WALLET.FILE_NAME, STORE.WALLET.FILE_NAME);
      if (!error) {
        dispatch({
          type: ACTION_NAME.SET_WALLET,
          data: walletData
        });
        console.log('fetchWallet', walletData);
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
      id: v4(),
      name: '',
      balance: 0,
      type: 0,
      creditLine: 0,
      index: tempData.length
    }]);
  };

  const handleEdit = () => {
    setEditing(true);
    setTempData(data.map((row, index) => ({ ...row, index })));
  };

  const handleCancel = () => {
    setEditing(false);
    setTempData([]);
  };

  const handleRemove = (index) => async () => {
    setTempData((oldData) => {
      const newData = [...oldData];
      newData.splice(index, 1);
      return newData;
    });
  };

  const handleSubmit = (newData) => async () => {
    if (newData.every((row) => row.name.trim())) {
      setLoading(true);
      await window.electron.SET_STORE_DATA({
        storeFileName: STORE.WALLET.FILE_NAME,
        data: newData
      });
      await fetchWallet();
      handleCancel();
    } else {
      message.warn('数据不符合要求，请修改');
    }
  };

  // 初始化操作项
  const handleOperator = () => {
    if (!editing) {
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
        { ...OPERATOR.FINISH, clickEvent: handleSubmit(tempData) },
        { ...OPERATOR.CANCEL, clickEvent: handleCancel }
      ];
      dispatch({
        type: ACTION_NAME.SET_OPERATOR,
        data: operatorData
      });
    }
  };

  // sortable method
  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      setLoading(true);
      const newData = arrayMoveImmutable([].concat(sortData), oldIndex, newIndex).filter(
        (el) => !!el
      );
      handleSubmit(newData)();
    }
  };

  const DraggableContainer = useCallback((props) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  ), [onSortEnd]);

  const DraggableBodyRow = useCallback(({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = sortData.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  }, [sortData]);

  useEffect(() => {
    handleOperator();
  }, [handleOperator]);

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div className="ledger-wallet ledger-home-content-component">
      <Table
        rowKey="index"
        bordered
        expandable={{ showExpandColumn: false }}
        dataSource={editing ? tempData : sortData}
        pagination={false}
        components={editing ? null : {
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow
          }
        }}
      >
        {!editing
          && (
            <Column
              title="排序"
              dataIndex="sort"
              key="sort"
              width={70}
              align="center"
              className="drag-visible"
              render={() => <DragHandle />}
            />
          )}
        <Column
          title="账户"
          dataIndex="name"
          key="name"
          render={(name, record, index) => (editing ? (
            <Input
              value={name}
              placeholder="账户名不能为空"
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
          render={(type, record, index) => (editing ? (
            <Select
              defaultValue={type}
              options={[{ label: '储蓄账户', value: 0 }, { label: '信用账户', value: 1 }]}
              onChange={(e) => {
                setTempData((oldData) => {
                  const newData = [...oldData];
                  newData[index].type = e;
                  return newData;
                });
              }}
              size="small"
            />
          ) : <Tag color={type === 0 ? 'green' : 'orange'}>{type === 0 ? '储蓄账户' : '信用账户'}</Tag>)}
        />
        <Column
          title="余额"
          dataIndex="balance"
          key="balance"
          render={(balance, record, index) => (editing ? (
            <InputNumber
              precision={2}
              controls={false}
              value={balance / 100}
              onChange={(val) => {
                setTempData((oldData) => {
                  const newData = [...oldData];
                  newData[index].balance = val * 100;
                  return newData;
                });
              }}
              size="small"
              style={{ width: '100%' }}
            />
          ) : <Tag color={balance < 0 ? 'red' : 'green'}>{(balance / 100).toFixed(2)}</Tag>)}
        />
        <Column
          title="信用额度"
          dataIndex="creditLine"
          key="creditLine"
          render={(creditLine, record, index) => {
            const curData = editing ? tempData : data;
            if (curData[index].type === 0) return '-';
            if (!editing) return <Tag color={creditLine < 0 ? 'red' : 'orange'}>{(creditLine / 100).toFixed(2)}</Tag>;
            return (
              <InputNumber
                precision={2}
                controls={false}
                min={0}
                value={creditLine / 100}
                onChange={(val) => {
                  setTempData((oldData) => {
                    const newData = [...oldData];
                    newData[index].creditLine = val * 100;
                    return newData;
                  });
                }}
                size="small"
                style={{ width: '100%' }}
              />
            );
          }}
        />
        <Column
          title="信用余额"
          key="creditBalance"
          render={(text, record, index) => {
            const curData = editing ? tempData : data;
            if (curData[index].type === 0) return '-';
            const creditBalance = curData[index].balance + curData[index].creditLine;
            return <Tag color={creditBalance < 0 ? 'red' : 'orange'}>{(creditBalance / 100).toFixed(2)}</Tag>;
          }}
        />
        {editing && (
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
                <DeleteOutlined className="ledger-wallet-remove" />
              </Popconfirm>
            )}
          />
        )}
      </Table>
    </div>
  );
}
