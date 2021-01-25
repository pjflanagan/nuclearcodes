
import { GAMEPLAY } from '../gameplay';
import { NEXT_SLIDE, UPDATE_GAME_STATE } from '../actions';

const initState = {
  slides: [GAMEPLAY[0]],
  roomName: '',
  me: {
    isHost: false
  },
  gameState: {
    players: [],
    current: 'LOBBY',
    round: 0,
  }
};

const GameReducer = (state = initState, action) => {
  console.log(action);
  switch (action.type) {
    case NEXT_SLIDE:
      return { ...state, ...{ slides: [...state.slides, action.slide] } };
    case UPDATE_GAME_STATE:
      return { ...state, ...{ gameState: action.gameState } };
    default:
      return state;
  }
}

export { GameReducer };
