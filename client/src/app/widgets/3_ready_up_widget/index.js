import React from 'react';

import { Slide, PlayerList, Button } from '../../elements';
import { getMe } from '../../game/GameComponent';

import Style from './style.module.css';

const MIN_PLAYERS_PER_GAME = 5;

class ReadyUpWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      ready: false,
    };

    this.readyUp = this.readyUp.bind(this);
  }

  componentDidMount() {
    this.updateGameState();
  }

  // only update our local state if this element isCurrent
  // this way when we move slides the data doesn't vanish
  componentDidUpdate(prevProps) {
    if (this.props.isCurrent && prevProps !== this.props) {
      this.updateGameState();
    }
  }

  updateGameState() {
    const { gameState: { players } } = this.props;
    this.setState({
      players,
    });
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
    const { socketID } = this.props;
    const { ready, players } = this.state;
    // ready up is for everyone, all need to be ready
    // ready up option becomes avaialable when everyone is here
    // also I should show which agent's have not readied up
    return (
      <Slide>
        <PlayerList
          players={players}
          me={getMe(players, socketID)}
        />
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