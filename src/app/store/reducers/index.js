import { combineReducers } from 'redux';
import classification from './classification';
import operator from './operator';

export default combineReducers({
  classification,
  operator
});
