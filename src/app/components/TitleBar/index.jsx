import './index.less';
import { MinusOutlined, PlusOutlined, BorderOutlined, CloseOutlined } from '@ant-design/icons';
import Icon from '../Icon';

export default () => {
  const handleMinimize = () => window.electron.MINIMIZE();
  const handleMaximize = () => window.electron.MAXIMIZE();
  const handleClose = () => window.electron.CLOSE();

  return (
    <div className="ledger-title-bar">
      <div className="ledger-title-bar__main">
        <Icon>
          <PlusOutlined className="ledger-title-bar__icon" />
        </Icon>
      </div>
      <div className="ledger-title-bar__operator">
        <Icon className="ledger-title-bar__operator-icon" onClick={handleMinimize}>
          <MinusOutlined className="ledger-title-bar__icon" />
        </Icon>
        <Icon className="ledger-title-bar__operator-icon" onClick={handleMaximize}>
          <BorderOutlined className="ledger-title-bar__icon" />
        </Icon>
        <Icon className="ledger-title-bar__operator-icon" onClick={handleClose}>
          <CloseOutlined className="ledger-title-bar__icon" />
        </Icon>
      </div>
    </div>
  );
};
