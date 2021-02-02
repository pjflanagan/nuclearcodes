
import { GAMEPLAY } from '../gameplay';
import { NEXT_SLIDE, UPDATE_GAME_STATE, SET_ERRORS } from '../actions';

const initState = {
  slides: [GAMEPLAY[0]],
  gameState: {
    players: [],
    round: 0,
    // player doesn't really need to know round
    // player doesn't need to know code, fakeCode, or gameState enum
  },
  errors: []
};

const GameReducer = (state = initState, action) => {
  switch (action.type) {
    case NEXT_SLIDE:
      return { ...state, ...{ slides: [...state.slides, action.slide] }, ...{ errors: [] } };
    case UPDATE_GAME_STATE:
      return { ...state, ...{ gameState: action.gameState }, ...{ errors: [] } };
    case SET_ERRORS:
      return { ...state, ...{ errors: action.errors } };
    default:
      return state;
  }
}

export { GameReducer };
