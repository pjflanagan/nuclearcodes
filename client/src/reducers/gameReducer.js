
import { GAMEPLAY } from '../gameplay';
import { NEXT_SLIDE, UPDATE_GAME_STATE } from '../actions';

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
      return { ...state, ...{ slides: [...state.slides, action.slide] } };
    case UPDATE_GAME_STATE:
      return { ...state, ...{ gameState: action.gameState } };
    // TODO: errors, sometimes we are adding a new slide, sometimes we are
    // setting errors on an existing slide, should we maybe just
    // have a permanant error slide at the bottom, where all errors go
    // server and widget errors
    default:
      return state;
  }
}

export { GameReducer };
