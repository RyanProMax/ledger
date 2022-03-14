import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ACTION_NAME, OPERATOR } from '../../constant';
import './index.less';

export default function Record() {
  const dispatch = useDispatch();

  const handleAdd = () => {
    console.log('handleAdd');
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

  return (
    <div className="ledger-home-content-component">
      <div className="ledger-record ledger-home-component__general">
        Dashboard
      </div>
    </div>
  );
}
