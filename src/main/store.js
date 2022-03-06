const path = require('path');
const fe = require('fs-extra');
const { AppInfo } = require('./app');
const { Low, JSONFile } = require('lowdb-node');
const { v4 } = require('uuid');

let STORE_PATH;

const initStore = async () => {
  const appInfo = AppInfo.getInstance();
  const USER_DATA_PATH = appInfo.constant.get('USER_DATA_PATH');
  STORE_PATH = path.resolve(USER_DATA_PATH, 'LedgerStore');
  appInfo.constant.set('STORE_PATH', STORE_PATH);
  if (!fe.existsSync(STORE_PATH)) {
    fe.mkdirSync(STORE_PATH);
  }

  await initUserData();
};

const initUserData = async () => {
  const file = path.resolve(STORE_PATH, 'user.json');
  const adapter = new JSONFile(file);
  const userDb = new Low(adapter);
  await userDb.read();
  userDb.data ||= {
    id: v4(),
    nickName: '',
    realName: '',
    sex: -1,
    birthDay: 0
  };
  await userDb.write();
};

module.exports = {
  initStore
};
