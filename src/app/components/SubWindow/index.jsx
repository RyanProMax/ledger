import {
  MinusOutlined, BorderOutlined, CloseOutlined
} from '@ant-design/icons';
import Icon from '../Icon';
import './index.less';

export default function SubWindow({
  renderOperation = () => null,
  minimize = true, maximize = true, windowName, children, realClose = true
}) {
  const handleMinimize = () => window.electron.MINIMIZE(windowName);
  const handleMaximize = () => window.electron.MAXIMIZE(windowName);
  const handleClose = () => (realClose ? window.electron.CLOSE(windowName) : window.electron.HIDE(windowName));

  return (
    <div className="ledger-sub-window">
      <div className="ledger-sub-window-menu">
        {renderOperation('ledger-sub-window-menu__icon')}
        <div className="ledger-sub-window-menu__operator">
          { minimize && (
          <Icon className="ledger-sub-window-menu__icon" onClick={handleMinimize}>
            <MinusOutlined />
          </Icon>
          ) }
          { maximize && (
          <Icon className="ledger-sub-window-menu__icon" onClick={handleMaximize}>
            <BorderOutlined />
          </Icon>
          ) }
          <Icon className="ledger-sub-window-menu__icon" onClick={handleClose}>
            <CloseOutlined />
          </Icon>
        </div>
      </div>
      {children}
    </div>
  );
}
