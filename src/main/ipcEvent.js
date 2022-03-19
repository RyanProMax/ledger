const { ipcMain, BrowserWindow, app } = require('electron');
const path = require('path');
const { AppInfo } = require('./app');
const { CHANNEL_NAME } = require('./constant');
const { getStoreData, setStoreData } = require('./store');
const { parsePageUrl, isDev } = require('./utils');

const registerMainIPCEvent = () => {
  const appInfo = AppInfo.getInstance();

  // main-window-event
  const mainWindow = appInfo.windowStore.get('mainWindow');
  mainWindow.on('maximize', () => mainWindow.webContents.send(CHANNEL_NAME.NORMAL.RECEIVE_MESSAGE, { type: 'maximize', isMaximized: true }));
  mainWindow.on('unmaximize', () => mainWindow.webContents.send(CHANNEL_NAME.NORMAL.RECEIVE_MESSAGE, { type: 'maximize', isMaximized: false }));
  mainWindow.on('close', () => app.quit());

  // main-process-event
  ipcMain.handle(CHANNEL_NAME.PRELOAD.MINIMIZE, (event, windowName) => appInfo.windowStore.get(windowName).minimize());
  ipcMain.handle(CHANNEL_NAME.PRELOAD.MAXIMIZE, (event, windowName) => {
    const targetWindow = appInfo.windowStore.get(windowName);
    if (targetWindow.isMaximized()) {
      targetWindow.restore();
    } else {
      targetWindow.maximize();
      targetWindow.webContents.send(CHANNEL_NAME.NORMAL.RECEIVE_MESSAGE, { type: 'resize', isMaximized: true });
    }
  });
  ipcMain.handle(CHANNEL_NAME.PRELOAD.CLOSE, (event, windowName) => {
    appInfo.windowStore.get(windowName).close();
    appInfo.windowStore.delete(windowName);
  });
  ipcMain.handle(CHANNEL_NAME.PRELOAD.HIDE, (event, windowName) => appInfo.windowStore.get(windowName).hide());

  // get data
  ipcMain.handle(CHANNEL_NAME.PRELOAD.GET_STORE_DATA, (event, ...args) => getStoreData(...args));
  // set data
  ipcMain.handle(CHANNEL_NAME.PRELOAD.SET_STORE_DATA, (event, ...args) => setStoreData(...args));

  // create sub-window
  ipcMain.handle(CHANNEL_NAME.PRELOAD.INIT_SUB_WINDOW, async (events, {
    windowName, windowPage, windowConfig, message
  }) => {
    let subWindow = appInfo.windowStore.get(windowName);
    if (!subWindow) {
      subWindow = new BrowserWindow({
        width: 600,
        height: 450,
        minWidth: 600,
        minHeight: 450,
        frame: false,
        webPreferences: { preload: path.join(__dirname, 'preload.js') },
        ...windowConfig
      });
      subWindow.setMenu(null);
      subWindow.loadURL(parsePageUrl(windowPage));
      if (isDev) {
        subWindow.webContents.openDevTools();
      }
      appInfo.windowStore.set(windowName, subWindow);
      subWindow.on('maximize', () => subWindow.webContents.send(CHANNEL_NAME.NORMAL.RECEIVE_MESSAGE, { type: 'resize', isMaximized: true }));
      subWindow.on('unmaximize', () => subWindow.webContents.send(CHANNEL_NAME.NORMAL.RECEIVE_MESSAGE, { type: 'resize', isMaximized: false }));
      // 如果创建窗口时携带参数一并发送，节省一次IPC通信
      if (message) {
        subWindow.webContents.on('did-finish-load', () => {
          subWindow.webContents.send(CHANNEL_NAME.NORMAL.RECEIVE_MESSAGE, message);
        });
      }
    } else {
      if (!subWindow.isVisible()) {
        subWindow.show();
      }
      if (message) {
        subWindow.webContents.send(CHANNEL_NAME.NORMAL.RECEIVE_MESSAGE, message);
      }
    }
    return true;
  });
  // renderer send message
  ipcMain.handle(CHANNEL_NAME.PRELOAD.SEND_MESSAGE, (event, windowName, ...args) => {
    try {
      const targetWindow = appInfo.windowStore.get(windowName);
      if (!targetWindow || !args || !args.length) return false;
      targetWindow.webContents.send(CHANNEL_NAME.NORMAL.RECEIVE_MESSAGE, ...args);
      return true;
    } catch (e) {
      return false;
    }
  });

  // dev-tools
  ipcMain.handle(CHANNEL_NAME.PRELOAD.OPEN_DEV_TOOLS, (event, windowName) => {
    const targetWindow = appInfo.windowStore.get(windowName);
    if (targetWindow) {
      targetWindow.webContents.openDevTools();
    }
  });
};

module.exports = {
  registerMainIPCEvent
};
