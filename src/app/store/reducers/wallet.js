import { ACTION_NAME } from '../../constant';

const initState = [];

export default function wallet(state = initState, action) {
  switch (action.type) {
    case ACTION_NAME.SET_WALLET:
      return action.data;
    default:
      return state;
  }
}
