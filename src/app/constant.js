import {
  PlusOutlined, EditOutlined, CheckOutlined, CloseOutlined
} from '@ant-design/icons';

export const ACTION_NAME = {
  SET_CLASSIFICATION: 'SET_CLASSIFICATION',
  SET_WALLET: 'SET_WALLET',
  SET_OPERATOR: 'SET_OPERATOR'
};

export const OPERATOR = {
  ADD: {
    id: 'ADD',
    icon: PlusOutlined
  },
  EDIT: {
    id: 'EDIT',
    icon: EditOutlined
  },
  FINISH: {
    id: 'FINISH',
    icon: CheckOutlined
  },
  CANCEL: {
    id: 'CANCEL',
    icon: CloseOutlined
  }
};
