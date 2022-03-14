const path = require('path');
const fse = require('fs-extra');
const { Low, JSONFile } = require('lowdb-node');
const { AppInfo } = require('../app');
const DEFAULT_MODEL = require('./model');

let STORE_PATH;

/**
 * @description 初始化数据库
 */
const initStore = async () => {
  const appInfo = AppInfo.getInstance();
  const USER_DATA_PATH = appInfo.constant.get('USER_DATA_PATH');
  STORE_PATH = path.resolve(USER_DATA_PATH, 'LedgerStore');
  appInfo.constant.set('STORE_PATH', STORE_PATH);
  fse.ensureDirSync(STORE_PATH);
};

/**
 * @description 获取数据库数据
 */
const getStoreData = async (modelName, storeFileName, isDynamic = false, payload) => {
  try {
    const file = path.resolve(STORE_PATH, storeFileName);
    const adapter = new JSONFile(file);
    const db = new Low(adapter);
    await db.read();
    if (!isDynamic) {
      db.data = db.data || DEFAULT_MODEL[modelName].DATA;
    } else {
      db.data = db.data || new DEFAULT_MODEL[modelName].CLASS(payload);
    }
    if (!fse.existsSync(file)) {
      await db.write();
    }
    return { status: 0, error: null, data: db.data };
  } catch (e) {
    return { status: 1, error: e.message, data: null };
  }
};

/**
 * @description 设置数据库数据
 */
const setStoreData = async ({ storeFileName, data }) => {
  try {
    const file = path.resolve(STORE_PATH, storeFileName);
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
