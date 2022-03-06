const { app } = require('electron');

class AppInfo {
  constructor() {
    this.constant = new Map();
    this.windowStore = new Map();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AppInfo();
    }
    return this.instance;
  }
}

const initAppData = () => {
  const USER_DATA_PATH = app.getPath('userData');
  const appInfo = AppInfo.getInstance();
  appInfo.constant.set('USER_DATA_PATH', USER_DATA_PATH);
};

module.exports = {
  AppInfo,
  initAppData
};
