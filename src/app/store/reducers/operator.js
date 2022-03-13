import { ACTION_NAME } from '../../constant';

const initState = [];

export default function operator(state = initState, action) {
  switch (action.type) {
    case ACTION_NAME.SET_OPERATOR:
      return action.data;
    default:
      return state;
  }
}
