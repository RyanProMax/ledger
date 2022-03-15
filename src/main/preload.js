const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
const { CHANNEL_NAME } = require('./constant');
const { isDev } = require('./utils');
const packageJson = isDev ? require('../../package.json') : require('../package.json');

/**
 * @description 往渲染进程注入主进程方法
 */
const channelInvoke = () => {
  const ret = {};
  Object.keys(CHANNEL_NAME.PRELOAD).forEach((channel) => {
    ret[channel] = (...args) => ipcRenderer.invoke(channel, ...args);
  });
  return ret;
};

contextBridge.exposeInMainWorld('electron', {
  packageJson,
  ...channelInvoke(),
  SUBSCRIBE: (channel, listener) => {
    ipcRenderer.on(channel, (event, ...args) => listener(...args));
  },
  UNSUBSCRIBE: (channel, listener) => ipcRenderer.removeListener(channel, listener)
});

contextBridge.exposeInMainWorld('nodeFunction', {
  path
});
