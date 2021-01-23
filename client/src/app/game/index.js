import React from 'react';

import Style from './style.module.css';

import { SLIDES, getNextSlide } from './slides';

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

  doneCallback(next) {
    // TODO: in done callback there will be other prompts
    // send SLIDE id to the server so we know what they entered
    const { slides } = this.state;

    if (!!next && !!next.slide) {
      this.setState({
        slides: [...slides, getNextSlide(next.slide)]
      });
    }
  }

  getComponentForSlide(slide, key) {
    return (
      <slide.widget
        key={key}
        data={slide.data}
        doneCallback={() => this.doneCallback(slide.next)}
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
