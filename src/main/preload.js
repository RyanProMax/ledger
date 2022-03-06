const { contextBridge, ipcRenderer } = require('electron');
const { CHANNEL_NAME } = require('./constant');
const packageJson = require('../../package.json');
const path = require('path');

/**
 * @description 往渲染进程注入主进程方法
 */
const channelInvoke = () => {
  const ret = {};
  Object.keys(CHANNEL_NAME).forEach((channel) => {
    ret[channel] = (...args) => ipcRenderer.invoke(channel, ...args);
  });
  return ret;
};

contextBridge.exposeInMainWorld('electron', {
  packageJson,
  ...channelInvoke()
});

contextBridge.exposeInMainWorld('nodeFunction', {
  path
});