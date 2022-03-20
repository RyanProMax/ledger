import { MinusOutlined, BorderOutlined, CloseOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import Icon from '../Icon';

import IconRestore from '../../assets/restore.svg';
import './index.less';

export default function SubWindow({
  renderOperation = () => null,
  minimize = true, maximize = true, windowName, children, realClose = true
}) {
  const [isMaximize, setIsMaximize] = useState(false);
  const handleMinimize = () => window.electron.MINIMIZE(windowName);
  const handleMaximize = () => window.electron.MAXIMIZE(windowName);
  const handleClose = () => (realClose ? window.electron.CLOSE(windowName) : window.electron.HIDE(windowName));

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
    <div className="ledger-sub-window">
      <div className="ledger-sub-window-menu">
        {renderOperation('ledger-sub-window-menu__icon')}
        <div className="ledger-sub-window-menu__operator">
          { minimize && (
          <Icon tipText="最小化" tipPlacement="left" className="ledger-sub-window-menu__icon" onClick={handleMinimize}>
            <MinusOutlined />
          </Icon>
          ) }
          { maximize && (
          <Icon tipText={isMaximize ? '恢复' : '最大化'} tipPlacement="left" className="ledger-sub-window-menu__icon" onClick={handleMaximize}>
            {isMaximize ? <ReactSVG src={IconRestore} className="ledger-svg" /> : <BorderOutlined /> }
          </Icon>
          ) }
          <Icon tipText="关闭" tipPlacement="left" className="ledger-sub-window-menu__icon" onClick={handleClose}>
            <CloseOutlined />
          </Icon>
        </div>
      </div>
      {children}
    </div>
  );
}
