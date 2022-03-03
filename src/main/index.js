const { app, BrowserWindow } = require('electron');
const path = require('path');
const { parsePageUrl } = require('./utils');

(async () => {
  await app.whenReady();
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.loadURL(parsePageUrl('index'));
  mainWindow.webContents.openDevTools();
})();
