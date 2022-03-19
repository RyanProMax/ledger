import classnames from 'classnames';
import './index.less';

export default function Divider({
  className, orientation, dashed, children, ...rest
}) {
  return (
    <div
      className={classnames('ledger-divider', {
        'ledger-divider--dashed': dashed,
        'ledger-divider--left': orientation === 'left',
        'ledger-divider--right': orientation === 'right'
      }, className)}
      {...rest}
    >
      <div className="ledger-divider__content">
        {children}
      </div>
    </div>
  );
}
