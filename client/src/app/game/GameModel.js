
import { connect } from 'react-redux'

import { nextSlide } from '../../actions';
import { getNextPlay } from '../../gameplay';

import { GameComponent } from './GameComponent';

const NEXT_SLIDE_DELAY = 360;

const mapStateToProps = (state) => ({
  slides: state.slides,
  gameState: state.gameState
});

const mapDispatchToProps = dispatch => ({
  dispatchDoneCallback: ({ next, prevData, delay = 0 }) => {
    // if there is a next function
    if (!!next) {
      const nextPlayID = next(prevData);
      // if the next function has a slidem take us to it
      if (nextPlayID !== 'WAIT') {
        setTimeout(() =>
          dispatch(
            nextSlide(getNextPlay(nextPlayID), prevData)
          ),
          NEXT_SLIDE_DELAY + delay);
      }
      // otherwise wait
    }
    // if there is not a next function we are waiting
  },
});

const Game = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameComponent);

export { Game }