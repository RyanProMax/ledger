const { app, BrowserWindow } = require('electron');
const path = require('path');
const { parsePageUrl } = require('./utils');
const { registerMainIPCEvent } = require('./ipcEvent');
const { initStore } = require('./store');
const { AppInfo, initAppData } = require('./app');

const initMain = async () => {
  await app.whenReady();
  const appInfo = AppInfo.getInstance();

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL(parsePageUrl('home'));
  mainWindow.webContents.openDevTools();
  appInfo.windowStore.set('mainWindow', mainWindow);

  initAppData();
  registerMainIPCEvent();
  await initStore();
};

initMain();
