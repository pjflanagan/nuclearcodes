
import { connect } from 'react-redux'

import { nextSlide, setErrors } from '../../actions';
import { getNextSlide } from '../../gameplay';

import { GameComponent } from './GameComponent';

const NEXT_SLIDE_DELAY = 360;

const mapStateToProps = (state) => ({
  slides: state.slides,
  gameState: state.gameState,
  errors: state.errors
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
            nextSlide(getNextSlide(nextPlayID), prevData)
          ),
          NEXT_SLIDE_DELAY + delay);
      }
      // otherwise wait
    }
    // if there is not a next function we are waiting
  },
  setErrors: ({ errors }) => {
    dispatch(setErrors(errors))
  }
});

const Game = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameComponent);

export { Game }