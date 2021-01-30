import React from 'react';

import { Slide, Player, Button } from '../../elements';

import Style from './style.module.css';

const PLAYERS_PER_GAME = 8;

class ReadyUpWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false
    };

    this.readyUp = this.readyUp.bind(this);
  }

  getPrompt() {
    const { ready } = this.state;
    const { gameState, isCurrent } = this.props;

    if (gameState.players.length >= PLAYERS_PER_GAME) {
      if (ready) {
        if (!isCurrent) {
          return `Mission is a go.`
        }
        return `Waiting for other agents to ready up...`;
      }
      return `Ready Up!`;
    }
    return `Waiting for ${PLAYERS_PER_GAME - gameState.players.length} more players to join...`;
  }

  readyUp() {
    const { gameState, socketService } = this.props;
    if (gameState.players.length < PLAYERS_PER_GAME) {
      // if not ready then do nothing
      return;
    }
    socketService.pollResponse({
      type: 'LOBBY',
      data: true
    });
    this.setState({
      ready: true
    });
  }

  render() {
    const { ready } = this.state;
    const { gameState, me } = this.props;
    // ready up is for everyone, all need to be ready
    // ready up option becomes avaialable when everyone is here
    // also I should show which agent's have not readied up
    return (
      <Slide>
        <div className={Style.players}>
          {
            gameState.players.map((player, i) => (
              <div
                className={Style.playerHolder}
                key={i}
              >
                <Player
                  me={me}
                  doNotType={true}
                  player={player}
                />
              </div>
            ))
          }
        </div>
        <div className={Style.readyUpButtonHolder}>
          <Button
            onClick={() => this.readyUp()}
            disabled={ready}
          >
            {this.getPrompt()}
          </Button>
        </div>
      </Slide>
    );
  }
}

export { ReadyUpWidget };