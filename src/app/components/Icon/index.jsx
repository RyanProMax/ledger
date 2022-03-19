import './index.less';
import classnames from 'classnames';
import { Tooltip } from 'antd';

export default function Icon({
  tipText, tipPlacement = 'right', children, className, ...rest
}) {
  return (
    <Tooltip placement={tipPlacement} title={tipText} mouseEnterDelay={0.8}>
      <div className={classnames('ledger-icon', className)} {...rest}>
        {children}
      </div>
    </Tooltip>
  );
}
