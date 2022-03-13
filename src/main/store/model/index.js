const { STORE_NAME } = require('../../constant');

/**
 * @description default storage data
 */
const USER = require('./user');
const CLASSIFICATION = require('./classification');
const WALLET = require('./wallet');

module.exports = {
  [STORE_NAME.USER]: USER,
  [STORE_NAME.CLASSIFICATION]: CLASSIFICATION,
  [STORE_NAME.WALLET]: WALLET
};
