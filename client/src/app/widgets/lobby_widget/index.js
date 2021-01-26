
import React from 'react';

import { Slide, Input } from '../../elements';

import Style from './style.module.css';

// TODO: should game rooms be lowercase?
const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9\-_]*$/;

const validate = (roomName) => {
  if (roomName.length < 3) {
    return ["Room name must contain at least 3 characters."];
  }
  if (!roomName.match(ALPHANUMERIC_REGEX)) {
    return ["Room name must be alphanumeric and not contain spaces."];
  }
  // TODO: if joining but room doesn't exist, prompt them to create a new room
  // if creating room already exists, prompt them to joing
  return [];
}

class LobbyWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // createNewRoom: false,
      roomName: "",
      errors: []
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    // this.toggleCreateJoin = this.toggleCreateJoin.bind(this);
  }

  // toggleCreateJoin(createNewRoom) {
  //   this.setState({
  //     createNewRoom: createNewRoom
  //   });
  // }

  onChange(e) {
    this.setState({
      roomName: e.target.value,
    });
  }

  onKeyDown(e) {
    if (e.key === 'Enter') {
      this.onSubmit();
    }
  }

  onSubmit() {
    const roomName = this.getSanitizedRoomName();
    const errors = validate(roomName);
    if (errors.length === 0) {
      this.props.socketService.joinRoom({ roomName });
      this.props.doneCallback({ roomName });
      // TODO: const roomURLEncode = urlEncode(roomName);
      // TODO: on submit call the socket and set the url to be room name
      // this might require react router and this.props.history.push(`/${roomName}`)
    }
    this.setState({
      errors
    });
  }

  getSanitizedRoomName() {
    return this.state.roomName.trim().toLowerCase();
  }

  render() {
    const { errors } = this.state; // createNewRoom
    const { isCurrent } = this.props;
    return (
      <Slide>
        {/* <div className={`${Style.toggle} ${!isCurrent ? Style.disabled : ''}`}>
          <div className={Style.optionsHolder}>
            <div
              className={`${Style.option} ${createNewRoom ? '' : Style.selected}`}
              onClick={() => this.toggleCreateJoin(false)}
            >
              Join Room
            </div>
            <div
              className={`${Style.option} ${createNewRoom ? Style.selected : ''}`}
              onClick={() => this.toggleCreateJoin(true)}
            >
              Create New Room
            </div>
          </div>
        </div> */}
        <Input
          type="text"
          placeholder="Enter Room Name"
          onChange={e => this.onChange(e)}
          onKeyDown={e => this.onKeyDown(e)}
          disabled={!isCurrent}
          errors={errors}
        />
      </Slide>
    );
  }
}

export { LobbyWidget };