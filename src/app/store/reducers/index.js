import { combineReducers } from 'redux';
import classification from './classification';
import wallet from './wallet';
import record from './record';
import operator from './operator';

export default combineReducers({
  classification,
  wallet,
  record,
  operator
});
