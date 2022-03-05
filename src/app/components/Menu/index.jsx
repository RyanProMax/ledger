import classnames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../../resources/logo.png';
import Icon from '../Icon';
import './index.less';

export default ({ route }) => {
  const location = useLocation();
  const navigator = useNavigate();

  const handleJump = (route) => () => {
    navigator(route.path);
  };

  return (
    <div className="ledger-menu">
      <img src={logo} className="ledger-menu-logo" />
      {route.map((r, i) => (
        <Icon
          key={i}
          onClick={handleJump(r)}
          className={classnames('ledger-menu-item', {
            'ledger-menu-item--active': r.path === location.pathname
          })}>
          {<r.icon className="ledger-menu-item__icon" />}
        </Icon>
      ))}
    </div>
  );
};
