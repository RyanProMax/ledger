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
  MINIMIZE: 'MINIMIZE',
  MAXIMIZE: 'MAXIMIZE',
  CLOSE: 'CLOSE'
};

module.exports = {
  BASE_URL,
  PAGE_BASE_URL,
  CHANNEL_NAME
};
