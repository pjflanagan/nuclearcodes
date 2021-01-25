import React from 'react';

import { Slide, Player } from '../../elements';

import Style from './style.module.css';

class ReadyUpWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      done: false,
    };

  }

  render() {
    const { done } = this.state;
    console.log(this.props);
    const { gameState } = this.props;
    // TODO: ready up is for everyone, majority vote
    return (
      <Slide done={done}>
        {
          gameState.players.map((p, i) => (
            <Player
              key={i}
              id={p.id}
              name={p.name} />
          ))
        }
      </Slide>
    );
  }
}

export { ReadyUpWidget };