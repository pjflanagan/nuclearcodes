
import { connect } from 'react-redux'

import { nextSlide } from '../../actions';
import { getNextPlay } from '../../gameplay';

import { GameComponent } from './GameComponent';



// TODO: make this delay vary by slide
const NEXT_SLIDE_DELAY = 360;

const doneCallback = ({ next, prevData, dispatch }) => {
  // TODO: TODO: TODO: 
  // sometimes this will just send data to the server and not set next slide
  // server will be the one to tell us to move to the next slide
  if (!!next) {
    setTimeout(() =>
      dispatch(nextSlide(getNextPlay(next(), prevData))),
      NEXT_SLIDE_DELAY);
  }
}


// TODO: these take the store and turn it into props for the object
const mapStateToProps = (state) => ({
  slides: state.slides,
});

const mapDispatchToProps = dispatch => ({
  doneCallback: (next, prevData) => doneCallback({ next, prevData, dispatch }),
});

const Game = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameComponent);

export { Game }