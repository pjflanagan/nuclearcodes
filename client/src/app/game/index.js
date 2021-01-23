import React from 'react';

import Style from './style.module.css';

import { SLIDES, getNextSlide } from './slides';

// TODO: make this delay vary by slide
const NEXT_SLIDE_DELAY = 360;

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slides: [
        SLIDES[0]
      ],
    };

    this.doneCallback = this.doneCallback.bind(this);
  }

  doneCallback(next, prevData) {
    // TODO: in done callback there will be other prompts
    // send SLIDE id to the server so we know what they entered
    const { slides } = this.state;

    // TODO: next might have to be async and run out here
    // next().then(([nextSlide, prevData]) => )

    // TODO: maybe here on the callback we pull data from the callback

    if (!!next) {
      setTimeout(() => this.setState({
        slides: [...slides, getNextSlide(next(), prevData)]
      }), NEXT_SLIDE_DELAY);
    }
  }

  getComponentForSlide(slide, key) {
    return (
      <slide.widget
        key={key}
        data={slide.data}
        prevData={slide.prevData}
        doneCallback={(prevData) => this.doneCallback(slide.next, prevData)}
      />
    );
  }

  render() {
    const { slides } = this.state;
    return (
      <div className={Style.gameContainer}>
        <div className={Style.slidesHolder}>
          {
            slides.map((slide, i) => this.getComponentForSlide(slide, i))
          }
        </div>
      </div>
    );
  }
}

export { Game };
