import { ACTION_NAME } from '../constant';

const initState = [];

export default function classification(state = initState, action) {
  switch (action.type) {
    case ACTION_NAME.SET_CLASSIFICATION:
      return action.data;
    default:
      return state;
  }
}
