
import { connect } from 'react-redux'

import { changeSlide } from '../../actions';

import { GameComponent } from './GameComponent';



// TODO: make this delay vary by slide
const NEXT_SLIDE_DELAY = 360;

// const doneCallback = (next, prevData) => {
//   // TODO: in done callback there will be other prompts
//   // send SLIDE id to the server so we know what they entered
//   const { slides } = this.store;

//   // TODO: next might have to be async and run out here
//   // next().then(([nextSlide, prevData]) => )

//   // TODO: maybe here on the callback we pull data from the callback

//   if (!!next) {
//     setTimeout(() => this.setState({
//       slides: [...slides, getNextPlay(next(), prevData)]
//     }), NEXT_SLIDE_DELAY);
//   }
// }


// TODO: these take the store and turn it into props for the object
const mapStateToProps = (state) => ({
  slides: state.slides,
});

const mapDispatchToProps = dispatch => ({
  changeSlide: id => dispatch(changeSlide(id)),
});

const Game = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameComponent);

export { Game }