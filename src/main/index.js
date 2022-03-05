const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { parsePageUrl } = require('./utils');
const { CHANNEL_NAME } = require('./constant');

!(async () => {
  await app.whenReady();

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

  ipcMain.handle(CHANNEL_NAME.MINIMIZE, () => mainWindow.minimize());
  ipcMain.handle(CHANNEL_NAME.MAXIMIZE, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.handle(CHANNEL_NAME.CLOSE, () => mainWindow.close());
})();
