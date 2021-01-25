
import { connect } from 'react-redux'

import { nextSlide } from '../../actions';
import { getNextPlay } from '../../gameplay';

import { GameComponent } from './GameComponent';



// TODO: make this delay vary by slide
const NEXT_SLIDE_DELAY = 360;

const mapStateToProps = (state) => ({
  slides: state.slides,
  gameState: state.gameState
});

const mapDispatchToProps = dispatch => ({
  dispatchDoneCallback: (next, prevData) => {
    // TODO: TODO: TODO: 
    // sometimes this will just send data to the server and not set next slide
    // server will be the one to tell us to move to the next slide
    if (!!next) {
      setTimeout(() =>
        dispatch(nextSlide(getNextPlay(next(), prevData))),
        NEXT_SLIDE_DELAY);
    }
  },
});

const Game = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameComponent);

export { Game }