const path = require('path');
const { PAGE_BASE_URL } = require('./constant');

const isEnv = process.env.NODE_ENV === 'development';

const parsePageUrl = (pageName) => (isEnv
  ? `${PAGE_BASE_URL.DEV}/${pageName}/index.html`
  : path.resolve(PAGE_BASE_URL.PROD, `${pageName}.html`));

module.exports = {
  isEnv,
  parsePageUrl
};
