import React from 'react';

import { Player, Slide } from '../../elements';

import Style from './style.module.css';

class ChooseRoomWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playersInRooms: []
    }

    this.sendRoomChoice = this.sendRoomChoice.bind(this);
  }


  // only update our local state if this element isCurrent
  // this way when we move slides the data doesn't vanish
  componentDidUpdate(prevProps) {
    if (this.props.isCurrent && prevProps !== this.props) {
      const { gameState: { players } } = this.props;
      this.setState({
        playersInRooms: players.filter(p => p.response !== false)
      });
    }
  }

  sendRoomChoice(roomID) {
    this.props.socketService.pollResponse({
      type: 'ROUND_VOTE',
      data: {
        roomID,
        timestamp: Date.now()
      }
    });
  }

  render() {
    const { me } = this.props;
    const { playersInRooms } = this.state;
    return (
      <Slide>
        {/* Player Name List */}
        <div className={Style.roomRow}>
          {[...Array(5)].map((a, i) => (
            <div
              className={Style.roomHolder}
              key={i}
            >
              <div
                className={Style.room}
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