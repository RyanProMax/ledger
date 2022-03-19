const { app, BrowserWindow } = require('electron');
const path = require('path');
const { parsePageUrl, isDev } = require('./utils');
const { registerMainIPCEvent } = require('./ipcEvent');
const { initStore } = require('./store');
const { AppInfo, initAppData } = require('./app');

const initMain = async () => {
  await app.whenReady();
  const appInfo = AppInfo.getInstance();

  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 1080,
    minHeight: 720,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL(parsePageUrl('home'));
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  appInfo.windowStore.set('mainWindow', mainWindow);

  initAppData();
  registerMainIPCEvent();
  await initStore();
};

initMain();
