
import { GAMEPLAY } from '../gameplay';
import { NEXT_SLIDE, UPDATE_GAME_STATE } from '../actions';

const initState = {
  slides: [GAMEPLAY[0]],
  gameState: {
    players: [],
    // gameState and round might be unncessary for the player to know
  },

  // TODO: these might not be necessary
  roomName: '',
  id: '', // user's socket id
};

const GameReducer = (state = initState, action) => {
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
