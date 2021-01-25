import React from 'react';

import { Slide, Player } from '../../elements';

import Style from './style.module.css';

const MIN_PLAYERS = 1;

class ReadyUpWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      done: false,
      ready: false
    };

    this.readyUp = this.readyUp.bind(this);
  }

  componentDidMount() {
    this.input.focus();
  }

  getPrompt() {
    const { ready } = this.state;
    const { gameState } = this.props;

    if (gameState.players.length >= MIN_PLAYERS) {
      if (ready) {
        return `Waiting for other agents to ready up...`;
      }
      return `Ready Up!`;
    }
    return `Waiting for ${MIN_PLAYERS} players to join...`;
  }

  readyUp() {
    const { gameState, socketService } = this.props;
    if (gameState.players.length < MIN_PLAYERS) {
      // if not ready then do nothing
      return;
    }
    // TODO: send a ready up to the server
    socketService.pollResponse({
      type: 'ready-up',
      ready: true
    });
    this.setState({
      ready: true
    });
  }

  render() {
    const { done } = this.state;
    const { gameState } = this.props;
    // TODO: ready up is for everyone, majority vote
    // ready up option becomes avaialable when everyone is here
    // also I should show which agent's have not readied up
    return (
      <Slide done={done}>
        <div className={Style.players}>
          {
            gameState.players.map((p, i) => (
              <div className={Style.playerHolder}>
                <Player
                  key={i}
                  index={i}
                  id={p.id}
                  name={p.name} />
              </div>
            ))
          }
        </div>
        <div className={Style.readyUpButtonHolder}>
          <button
            className={Style.readyUpButton}
            ref={(input) => { this.input = input; }}
            tabIndex={0}
            onClick={() => this.readyUp()}
          >
            {this.getPrompt()}
          </button>
        </div>
      </Slide>
    );
  }
}

export { ReadyUpWidget };