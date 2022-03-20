import classnames from 'classnames';
import { round } from 'lodash-es';
import './index.less';

export default function Ticket({
  classNameText, subClassName, value, walletName,
  className, color = '#999', borderColor = '#999', dashed, style
}) {
  return (
    <div
      className={classnames('ledger-ticket', className)}
      style={{
        color, borderColor, borderStyle: dashed ? 'dashed' : 'solid', ...style
      }}
    >
      <div className="ledger-ticket-top">
        <span className="ledger-ticket-top__title">{classNameText}</span>
        {subClassName && (
          <span className="ledger-ticket-top__sub-title">
            {subClassName}
          </span>
        )}
      </div>
      <div className="ledger-ticket-mid">
        <span className="ledger-ticket-mid__value">{Math.abs(value / 100).toFixed(2)}</span>
      </div>
      <div className="ledger-ticket-bottom">
        <span className="ledger-ticket-bottom__wallet">{ walletName}</span>
      </div>
    </div>
  );
}
