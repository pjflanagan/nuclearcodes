import React from 'react';

import { Slide } from '../../elements';

import Style from './style.module.css';

const MOVE_HAND_DELAY = 800;
const TOTAL_ROUNDS = 5; // TODO: pass this in from server?

class DefconWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      round: this.props.gameState.round - 1
    }
  }

  componentDidMount() {
    setTimeout(
      () => {
        this.setState({ round: this.props.gameState.round });
        this.props.doneCallback();
      },
      MOVE_HAND_DELAY
    );
  }

  render() {
    const { round } = this.state;
    return (
      <Slide>
        <div className={Style.circle}>
          <div className={Style.dotsHolder}>
            {[...Array(TOTAL_ROUNDS)].map((e, i) => (
              <div
                key={i}
                className={Style.dot}
                style={{
                  transform: `translate(${-94 * Math.cos(i * Math.PI / 8)}px, ${-94 * Math.sin(i * Math.PI / 8)}px)`
                }}
              />
            ))}
          </div>
          <div className={Style.midnight}></div>
          <div className={Style.minuteHand}
            style={{
              transform: `rotate(${(round - TOTAL_ROUNDS) * Math.PI / 8}rad)`
            }}
          ></div>
        </div>
      </Slide>
    );
  }
}

export { DefconWidget };