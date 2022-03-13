const path = require('path');
const STORE_NAME = require('../global/StoreName.json');

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
  GET_STORE_DATA: 'GET_STORE_DATA',
  SET_STORE_DATA: 'SET_STORE_DATA'
};

const STORE_FILE_NAME = {
  [STORE_NAME.USER]: 'user.json',
  [STORE_NAME.CLASSIFICATION]: 'classification.json',
  [STORE_NAME.WALLET]: 'wallet.json'
};

module.exports = {
  BASE_URL,
  PAGE_BASE_URL,
  CHANNEL_NAME,
  STORE_NAME,
  STORE_FILE_NAME
};
