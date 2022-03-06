const path = require('path');
const { v4 } = require('uuid');

const BASE_URL = {
  DEV: 'http://localhost:3000',
  PROD: path.resolve(__dirname, '..')
};

const PAGE_BASE_URL = {
  DEV: `${BASE_URL.DEV}/src/app/pages`,
  PROD: path.resolve(BASE_URL.PROD, 'app.content')
};

const CHANNEL_NAME = {
  MINIMIZE: 'MINIMIZE',
  MAXIMIZE: 'MAXIMIZE',
  CLOSE: 'CLOSE',
  GET_USER_DATA: 'GET_USER_DATA',
  GET_CLASSIFICATION_DATA: 'GET_CLASSIFICATION_DATA'
};

const STORE_NAME = {
  USER: 'USER',
  CLASSIFICATION: 'CLASSIFICATION'
};

const STORE_FILE_NAME = {
  [STORE_NAME.USER]: 'user.json',
  [STORE_NAME.CLASSIFICATION]: 'classification.json'
};

const DEFAULT_DATA = {
  USER: { id: v4(), nickName: '', realName: '', sex: -1, birthDay: 0 },
  CLASSIFICATION: [
    {
      id: v4(),
      name: '餐饮',
      type: 1, // 收入为0，支出为1
      children: [
        {
          id: v4(),
          name: '日常伙食',
          type: 1,
          children: []
        },
        {
          id: v4(),
          name: '大快朵颐',
          type: 1,
          children: []
        }
      ]
    },
    { id: v4(), name: '交通', type: 1, children: [] },
    { id: v4(), name: '日常用品', type: 1, children: [] },
    { id: v4(), name: '工资', type: 0, children: [] },
    { id: v4(), name: '股票', type: 0, children: [] }
  ]
};

module.exports = {
  BASE_URL,
  PAGE_BASE_URL,
  CHANNEL_NAME,
  STORE_NAME,
  STORE_FILE_NAME,
  DEFAULT_DATA
};
