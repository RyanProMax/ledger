import './index.less';
import {
  MinusOutlined, BorderOutlined, CloseOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import Icon from '../Icon';
import IconRestore from '../../assets/restore.svg';

export default function TitleBar() {
  const [isMaximize, setIsMaximize] = useState(false);
  const handleMinimize = () => window.electron.MINIMIZE('mainWindow');
  const handleMaximize = () => window.electron.MAXIMIZE('mainWindow');
  const handleClose = () => window.electron.CLOSE('mainWindow');

  const activeOperator = useSelector((state) => state.operator);

  useEffect(() => {
    const cb = ({ type, isMaximized }) => {
      if (type === 'maximize') {
        setIsMaximize(isMaximized);
      }
    };
    // receive message from main process
    return window.electron.SUBSCRIBE('RECEIVE_MESSAGE', cb);
  }, []);

  return (
    <div className="ledger-title-bar">
      <div className="ledger-title-bar__main">
        {activeOperator.map((v) => (
          <Icon tipText={v.tipText} key={v.id} onClick={v.clickEvent} className="ledger-title-bar__operator-icon">
            <v.icon />
          </Icon>
        ))}

      </div>
      <div className="ledger-title-bar__operator">
        <Icon tipText="最小化" tipPlacement="left" className="ledger-title-bar__operator-icon" onClick={handleMinimize}>
          <MinusOutlined />
        </Icon>
        <Icon tipText={isMaximize ? '还原' : '最大化'} tipPlacement="left" className="ledger-title-bar__operator-icon" onClick={handleMaximize}>
          {isMaximize ? <ReactSVG src={IconRestore} className="ledger-svg" /> : <BorderOutlined /> }
        </Icon>
        <Icon tipText="关闭" tipPlacement="left" className="ledger-title-bar__operator-icon" onClick={handleClose}>
          <CloseOutlined />
        </Icon>
      </div>
    </div>
  );
}
