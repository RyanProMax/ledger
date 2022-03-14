const STORE = require('../../../global/Store.json');

/**
 * @description default storage data
 */
const USER = require('./user');
const CLASSIFICATION = require('./classification');
const WALLET = require('./wallet');
const RECORD = require('./record');

module.exports = {
  [STORE.USER.FILE_NAME]: USER,
  [STORE.CLASSIFICATION.FILE_NAME]: CLASSIFICATION,
  [STORE.WALLET.FILE_NAME]: WALLET,
  [STORE.RECORD.FILE_NAME]: RECORD
};
