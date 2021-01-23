import React from 'react';

import { Socket } from '../../helpers';

import Style from './style.module.css';
import { PromptWidget } from './widgets'
import { SLIDES } from './slides';

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

  doneCallback() {
    // TODO: in done callback there will be other prompts
    // send SLIDE id to the server so we know what they entered
    const { slides } = this.state;
    // this.setState({
    //   slides: [...slides, {
    //     type: 'prompt',
    //     text: "and hello here too"
    //   }]
    // });
  }

  getComponentForSlide(slide, key) {
    return (
      <PromptWidget
        key={key}
        doneCallback={this.doneCallback}
      >
        {slide.text}
      </PromptWidget>
    )
  }

  render() {
    const { slides } = this.state;
    return (
      <div className={Style.app}>
        {
          slides.map((slide, i) => this.getComponentForSlide(slide, i))
        }
      </div>
    );
  }
}

export { Game };
