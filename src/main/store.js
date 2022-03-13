const path = require('path');
const fse = require('fs-extra');
const { Low, JSONFile } = require('lowdb-node');
const { AppInfo } = require('./app');
const { DEFAULT_DATA, STORE_NAME } = require('./constant');

let STORE_PATH;

/**
 * @description 初始化数据库数据
 * STORE_NAME的属性名须与DEFAULT_DATA的保持一致对应
 */
const initStoreData = async (storeName) => {
  const file = path.resolve(STORE_PATH, STORE_NAME[storeName]);
  const adapter = new JSONFile(file);
  const db = new Low(adapter);
  await db.read();
  db.data = db.data || DEFAULT_DATA[storeName];
  await db.write();
};

/**
 * @description 获取数据库数据
 */
const getStoreData = async (storeName) => {
  try {
    const file = path.resolve(STORE_PATH, STORE_NAME[storeName]);
    const adapter = new JSONFile(file);
    const db = new Low(adapter);
    await db.read();
    db.data = db.data || DEFAULT_DATA[storeName];
    return { status: 0, error: null, data: db.data };
  } catch (e) {
    return { status: 1, error: e.message, data: null };
  }
};

const initStore = async () => {
  const appInfo = AppInfo.getInstance();
  const USER_DATA_PATH = appInfo.constant.get('USER_DATA_PATH');
  STORE_PATH = path.resolve(USER_DATA_PATH, 'LedgerStore');
  appInfo.constant.set('STORE_PATH', STORE_PATH);
  fse.ensureDirSync(STORE_PATH);

  const initStoreDataList = [STORE_NAME.USER, STORE_NAME.CLASSIFICATION];
  await Promise.all(initStoreDataList.map((name) => initStoreData(name)));
};

const setStoreData = async ({ storeName, data }) => {
  try {
    const file = path.resolve(STORE_PATH, STORE_NAME[storeName]);
    const adapter = new JSONFile(file);
    const db = new Low(adapter);
    await db.read();
    db.data = data;
    await db.write();
    return { status: 0, error: null, data: db.data };
  } catch (e) {
    return { status: 1, error: e.message, data: null };
  }
};

module.exports = {
  initStore,
  getStoreData,
  setStoreData
};
