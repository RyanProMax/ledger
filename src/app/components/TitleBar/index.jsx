import './index.less';
import {
  MinusOutlined, BorderOutlined, CloseOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Icon from '../Icon';

export default function TitleBar() {
  const handleMinimize = () => window.electron.MINIMIZE('mainWindow');
  const handleMaximize = () => window.electron.MAXIMIZE('mainWindow');
  const handleClose = () => window.electron.CLOSE('mainWindow');

  const activeOperator = useSelector((state) => state.operator);

  return (
    <div className="ledger-title-bar">
      <div className="ledger-title-bar__main">
        {activeOperator.map((v) => (
          <Icon key={v.id} onClick={v.clickEvent}>
            <v.icon className="ledger-title-bar__icon" />
          </Icon>
        ))}

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
}
