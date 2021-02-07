import React from 'react';

import { Player, Slide, PlayerList } from '../../elements';
import { GameWidget } from '../../game';

import Style from './style.module.css';

// TODO: a place to click to leave all rooms

class ChooseRoomWidget extends GameWidget {
  constructor(props) {
    super(props);

    this.state = {
      playersInRooms: [],
      players: []
    }

    this.sendRoomChoice = this.sendRoomChoice.bind(this);
    this.deselectRoom = this.deselectRoom.bind(this);
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
        roomID,
        timestamp: Date.now()
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
    const { gameState: { codeLength }, isCurrent } = this.props;
    const { playersInRooms, players } = this.state;
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
            <div
              className={Style.roomHolder}
              key={i}
              style={{
                width: `${100 / codeLength}%`
              }}
            >
              <div
                className={`${Style.room} ${!isCurrent ? Style.disabled : ''}`}
                onClick={e => this.sendRoomChoice(i)}
              >
                <div className={Style.roomNumber}>
                  {i + 1}
                </div>
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