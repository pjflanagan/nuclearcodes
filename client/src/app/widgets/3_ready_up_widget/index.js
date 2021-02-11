import React from 'react';

import { Slide, PlayerList, Button } from '../../elements';
import { GameWidget } from '../../game';

import Style from './style.module.css';

const MIN_PLAYERS_PER_GAME = 5; // TODO: global game rules for server and client?

class ReadyUpWidget extends GameWidget {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      ready: false,
    };

    this.readyUp = this.readyUp.bind(this);
  }

  getPrompt() {
    const { ready } = this.state;
    const { gameState, isCurrent } = this.props;

    if (gameState.players.length >= MIN_PLAYERS_PER_GAME) {
      if (ready) {
        if (!isCurrent) {
          return `Mission is a go.`
        }
        return `Waiting for other agents to ready up...`;
      }
      return `Ready Up!`;
    }
    return `Waiting for at least ${MIN_PLAYERS_PER_GAME - gameState.players.length} more players to join...`;
  }

  readyUp() {
    const { gameState, socketService } = this.props;
    if (gameState.players.length < MIN_PLAYERS_PER_GAME) {
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
    const { ready, players } = this.state;
    const { isCurrent } = this.props;
    const me = this.getMe();
    // ready up is for everyone, all need to be ready
    // ready up option becomes avaialable when everyone is here
    // also I should show which agent's have not readied up
    return (
      <Slide>
        <PlayerList
          players={players}
          me={me}
          doNotShowSpies={true}
          isCurrent={isCurrent}
        />
        <div className={Style.readyUpButtonHolder}>
          <Button
            onClick={() => this.readyUp()}
            disabled={ready}
          // ref={(input) => { this.input = input; }}
          >
            {this.getPrompt()}
          </Button>
        </div>
      </Slide>
    );
  }
}

export { ReadyUpWidget };