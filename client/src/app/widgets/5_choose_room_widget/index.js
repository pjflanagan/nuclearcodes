import React from 'react';

import { Player, Slide, PlayerList } from '../../elements';

import Style from './style.module.css';

// TODO: a place to click to leave all rooms

class ChooseRoomWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playersInRooms: [],
      players: []
    }

    this.updatePlayers = this.updatePlayers.bind(this);
    this.sendRoomChoice = this.sendRoomChoice.bind(this);
  }

  componentDidMount() {
    this.updatePlayers();
  }

  // only update our local state if this element isCurrent
  // this way when we move slides the data doesn't vanish
  componentDidUpdate(prevProps) {
    if (this.props.isCurrent && prevProps !== this.props) {
      this.updatePlayers();
    }
  }

  updatePlayers() {
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

  render() {
    const { me, gameState: { codeLength }, isCurrent } = this.props;
    const { playersInRooms, players } = this.state;
    return (
      <Slide>
        <PlayerList
          players={players}
          me={me}
        />
        <div className={Style.roomRow}>
          {[...Array(codeLength)].map((a, i) => (
            <div
              className={Style.roomHolder}
              key={i}
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