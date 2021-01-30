import React from 'react';

import { Pill, Slide } from '../../elements';

import Style from './style.module.css';

class ChooseRoomWidget extends React.Component {
  constructor(props) {
    super(props);

    this.sendRoomChoice = this.sendRoomChoice.bind(this);
  }

  sendRoomChoice(roomID) {
    console.log({ roomID });
    this.props.socketService.pollResponse({
      type: 'ROUND_VOTE',
      data: {
        roomID,
        timestamp: Date.now()
      }
    });
  }

  render() {
    const { gameState: { players } } = this.props;
    const playersInRooms = players.filter(p => p.response !== false);
    console.log({ playersInRooms });
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
                      <Pill key={p.id} isTyped={true}>{p.name}</Pill>
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