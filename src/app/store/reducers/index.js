import { combineReducers } from 'redux';
import classification from './classification';
import wallet from './wallet';
import operator from './operator';

export default combineReducers({
  classification,
  wallet,
  operator
});
