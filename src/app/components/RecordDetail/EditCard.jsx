import { CloseCircleOutlined } from '@ant-design/icons';
import {
  Input, Cascader, DatePicker, InputNumber, Radio, Select
} from 'antd';

const { TextArea } = Input;
const { Option } = Select;

export default function EditCard({
  defaultDateValue, type, classValue, classOptions, value, walletId, walletName, walletOptions, remark,
  handleChange, handleRemove, handelChangeType
}) {
  return (
    <div className="ledger-record-detail__card">
      <div className="ledger-record-detail__card-form">
        <span className="ledger-record-detail__card-label">日期</span>
        <DatePicker defaultValue={defaultDateValue} size="small" format="YYYY-MM-DD" onChange={(momentValue) => handleChange({ formatDate: momentValue.format('YYYY-MM-DD') })} />
        <span className="ledger-record-detail__card-label">收支类型</span>
        <Radio.Group
          value={type}
          size="small"
          onChange={handelChangeType}
        >
          <Radio value={0}>收入</Radio>
          <Radio value={1}>支出</Radio>
        </Radio.Group>
        <span className="ledger-record-detail__card-label">分类</span>
        <Cascader
          value={classValue}
          options={classOptions}
          fieldNames={{
            label: 'name',
            value: 'name'
          }}
          onChange={(val) => {
            const [className, subClassName] = val;
            handleChange({
              className,
              subClassName
            });
          }}
          size="small"
          style={{ width: '100%' }}
        />
        <span className="ledger-record-detail__card-label">金额</span>
        <InputNumber
          value={value}
          precision={2}
          controls={false}
          onChange={(val) => {
            if ((type === 0 && val < 0) || (type === 1 && val > 0)) {
              handleChange({ value: -val });
            } else {
              handleChange({ value: val });
            }
          }}
          size="small"
          style={{ width: '100%' }}
        />
        <span className="ledger-record-detail__card-label">
          {type === 0 ? '收入' : '支出'}
          账号
        </span>
        <Select
          labelInValue
          size="small"
          value={{ value: walletId, label: walletName }}
          onChange={(val) => {
            handleChange({
              walletId: val.value,
              walletName: val.label
            });
          }}
        >
          {walletOptions.map((c) => (
            <Option key={c.id} value={c.id}>{c.name}</Option>
          ))}
        </Select>
        <span className="ledger-record-detail__card-label">备注</span>
        <TextArea
          value={remark}
          placeholder="备注"
          maxLength={100}
          onChange={(e) => handleChange({ remark: e.target.value })}
        />
      </div>
      <CloseCircleOutlined className="ledger-record-detail__card-remove" onClick={handleRemove} />
    </div>
  );
}
