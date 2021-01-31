import React from 'react';

import { Slide } from '../../elements';

import Style from './style.module.css';

const CHANGE_DELAY = 1000;

class DefconWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      round: this.props.gameState.round - 1
    }
  }

  componentDidMount() {
    setTimeout(
      () => this.setState({
        round: this.props.gameState.round
      }),
      CHANGE_DELAY
    );
    setTimeout(
      () => this.props.doneCallback(),
      2 * CHANGE_DELAY
    );
  }

  render() {
    const { round } = this.state;
    return (
      <Slide>
        <div className={Style.circle}>
          <div className={Style.dotsHolder}>
            {[...Array(4)].map((e, i) => (
              <div
                key={i}
                className={Style.dot}
                style={{
                  transform: `translate(${-90 * Math.cos(i * Math.PI / 6)}px, ${-90 * Math.sin(i * Math.PI / 6)}px)`
                }}
              />
            ))}
          </div>
          <div className={Style.midnight}></div>
          <div className={Style.minuteHand}
            style={{
              transform: `rotate(${(round - 4) * Math.PI / 6}rad)`
            }}
          ></div>
        </div>
      </Slide>
    );
  }
}

export { DefconWidget };