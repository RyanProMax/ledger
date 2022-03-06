const path = require('path');
const fe = require('fs-extra');
const { AppInfo } = require('./app');
const { Low, JSONFile } = require('lowdb-node');
const { DEFAULT_DATA, STORE_NAME } = require('./constant');

let STORE_PATH;

const initStore = async () => {
  const appInfo = AppInfo.getInstance();
  const USER_DATA_PATH = appInfo.constant.get('USER_DATA_PATH');
  STORE_PATH = path.resolve(USER_DATA_PATH, 'LedgerStore');
  appInfo.constant.set('STORE_PATH', STORE_PATH);
  if (!fe.existsSync(STORE_PATH)) {
    fe.mkdirSync(STORE_PATH);
  }

  const initStoreDataList = [STORE_NAME.USER, STORE_NAME.CLASSIFICATION];
  await Promise.all(initStoreDataList.map((name) => initStoreData(name)));
};

// STORE_NAME的属性名须与DEFAULT_DATA的保持一致对应
const initStoreData = async (storeName) => {
  const file = path.resolve(STORE_PATH, STORE_NAME[storeName]);
  const adapter = new JSONFile(file);
  const db = new Low(adapter);
  await db.read();
  db.data ||= DEFAULT_DATA[storeName];
  await db.write();
};

const getStoreData = async (storeName) => {
  try {
    const file = path.resolve(STORE_PATH, STORE_NAME[storeName]);
    const adapter = new JSONFile(file);
    const db = new Low(adapter);
    await db.read();
    db.data ||= DEFAULT_DATA[storeName];
    return { status: 1, error: null, data: db.data };
  } catch (e) {
    return { status: 0, error: e, data: null };
  }
};

module.exports = {
  initStore,
  getStoreData
};
