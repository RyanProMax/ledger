const path = require('path');

const BASE_URL = {
  DEV: 'http://localhost:3000',
  PROD: path.resolve(__dirname, '..')
};

const PAGE_BASE_URL = {
  DEV: `${BASE_URL.DEV}/src/app/pages`,
  PROD: path.resolve(BASE_URL.PROD, 'app.content')
};

const CHANNEL_NAME = {
  PRELOAD: {
    MINIMIZE: 'MINIMIZE',
    MAXIMIZE: 'MAXIMIZE',
    CLOSE: 'CLOSE',
    HIDE: 'HIDE',

    GET_STORE_DATA: 'GET_STORE_DATA',
    SET_STORE_DATA: 'SET_STORE_DATA',

    INIT_SUB_WINDOW: 'INIT_SUB_WINDOW',
    SEND_MESSAGE: 'SEND_MESSAGE',

    OPEN_DEV_TOOLS: 'OPEN_DEV_TOOLS'
  },
  NORMAL: {
    RECEIVE_MESSAGE: 'RECEIVE_MESSAGE'
  }
};

module.exports = {
  BASE_URL,
  PAGE_BASE_URL,
  CHANNEL_NAME
};
