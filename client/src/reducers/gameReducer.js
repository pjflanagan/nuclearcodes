
import { GAMEPLAY } from '../gameplay';
import { NEXT_SLIDE, JOIN_ROOM } from '../actions';

const initState = {
  slides: [GAMEPLAY[0]],
  roomName: '',
  me: {
    isHost: false
  },
  players: [],
  gameState: 'LOBBY',
  round: 0,
};

const GameReducer = (state = initState, action) => {
  switch (action.type) {
    case NEXT_SLIDE:
      return { ...state, ...{ slides: [...state.slides, action.slide] } };
    // case JOIN_ROOM:
    //   return { ...state, roomName}
    default:
      return state;
  }
}

export { GameReducer };
