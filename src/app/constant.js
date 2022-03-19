import {
  PlusOutlined, EditOutlined, CloseOutlined, SaveOutlined
} from '@ant-design/icons';

export const ACTION_NAME = {
  SET_CLASSIFICATION: 'SET_CLASSIFICATION',
  SET_WALLET: 'SET_WALLET',
  SET_OPERATOR: 'SET_OPERATOR',
  SET_RECORD: 'SET_RECORD'
};

export const OPERATOR = {
  ADD: {
    id: 'ADD',
    icon: PlusOutlined,
    tipText: '添加'
  },
  EDIT: {
    id: 'EDIT',
    icon: EditOutlined,
    tipText: '编辑'
  },
  FINISH: {
    id: 'FINISH',
    icon: SaveOutlined,
    tipText: '保存'
  },
  CANCEL: {
    id: 'CANCEL',
    icon: CloseOutlined,
    tipText: '取消'
  }
};
