
const initState = {
  slide: 'welcome',
  me: {
    isHost: false
  },
  players: []
};

const GameReducer = (state = initState, action) => {
  switch (action.type) {
    case 'updateSlide':
      return { ...state, ...{ slide: action.data } };
    default:
      return state;
  }
}

export default GameReducer;
