
import { NEXT_SLIDE } from '../actions';
import { GAMEPLAY } from '../gameplay';

const initState = {
  slides: [GAMEPLAY[0]],
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
    default:
      return state;
  }
}

export { GameReducer };
