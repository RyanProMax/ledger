import './index.less';
import classnames from 'classnames';

export default function Icon({ children, className, ...rest }) {
  return (
    <div className={classnames('ledger-icon', className)} {...rest}>
      {children}
    </div>
  );
}
