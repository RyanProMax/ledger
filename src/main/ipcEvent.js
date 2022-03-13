const { ipcMain } = require('electron');
const { AppInfo } = require('./app');
const { CHANNEL_NAME } = require('./constant');
const { getStoreData } = require('./store');

const registerMainIPCEvent = () => {
  const appInfo = AppInfo.getInstance();
  const mainWindow = appInfo.windowStore.get('mainWindow');

  ipcMain.handle(CHANNEL_NAME.MINIMIZE, () => mainWindow.minimize());
  ipcMain.handle(CHANNEL_NAME.MAXIMIZE, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.handle(CHANNEL_NAME.CLOSE, () => mainWindow.close());

  // get data
  ipcMain.handle(CHANNEL_NAME.GET_STORE_DATA, (event, ...args) => getStoreData(...args));
};

module.exports = {
  registerMainIPCEvent
};
