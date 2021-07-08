import React from 'react';

import { Player, Slide, PlayerList } from '../../elements';
import { GameWidget } from '../../game';

import Style from './style.module.css';

class ChooseRoomWidget extends GameWidget {
  constructor(props) {
    super(props);

    this.state = {
      playersInRooms: [],
      players: [],
      codeLength: 0
    }

    this.sendRoomChoice = this.sendRoomChoice.bind(this);
    this.deselectRoom = this.deselectRoom.bind(this);
  }

  componentDidMount() {
    const { gameState: { codeLength, players } } = this.props;
    this.setState({
      players,
      codeLength
    });
  }

  updateGameState() {
    const { gameState: { players } } = this.props;
    this.setState({
      playersInRooms: players.filter(p => p.response !== false),
      players
    });
  }

  sendRoomChoice(roomID) {
    this.props.socketService.pollResponse({
      type: 'ROUND_CHOOSE_ROOM',
      data: {
        roomID
      }
    });
  }

  deselectRoom() {
    this.props.socketService.pollResponse({
      type: 'ROUND_CHOOSE_ROOM',
      data: false
    });
  }

  render() {
    const { isCurrent } = this.props;
    const { playersInRooms, players, codeLength } = this.state;
    const me = this.getMe();
    return (
      <Slide>
        <div
          className={Style.playerListHolder}
          onClick={this.deselectRoom}
        >
          <PlayerList
            players={players}
            me={me}
            isCurrent={isCurrent}
          />
        </div>
        <div className={Style.roomRow}>
          {[...Array(codeLength)].map((a, i) => (
            <div className={`${Style.roomHolder} ${Style[`r${codeLength}`]}`} key={i}>
              <div
                className={`${Style.room} ${!isCurrent ? Style.disabled : ''}`}
                onClick={e => this.sendRoomChoice(i)}
              >
                <div className={Style.roomNumber}>{i + 1}</div>
                <div className={Style.players}>
                  {
                    playersInRooms.filter(p => p.response.roomID === i).map((p) => (
                      <Player
                        key={p.id}
                        doNotType={true}
                        me={me}
                        player={p}
                      />
                    ))
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </Slide>
    );
  }
}

export { ChooseRoomWidget }