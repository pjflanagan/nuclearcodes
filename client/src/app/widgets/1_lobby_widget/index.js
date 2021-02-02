
import React from 'react';
import { withRouter } from "react-router-dom";

import { Slide, Input } from '../../elements';

const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9\-_]*$/;

const validate = (roomName) => {
  if (roomName.length < 3) {
    return ["Room name must contain at least 3 characters."];
  }
  if (!roomName.match(ALPHANUMERIC_REGEX)) {
    return ["Room name must be alphanumeric, and not contain spaces."];
  }
  // we have no concept of create or join room
  return [];
}

class LobbyWidgetComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // createNewRoom: false,
      roomName: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { roomName } = this.props.match.params;
    if (!!roomName) {
      this.setState({ roomName }, this.onSubmit);
    }
  }

  onChange(e) {
    this.setState({
      roomName: e.target.value,
    });
  }

  onSubmit() {
    const roomName = this.getSanitizedRoomName();
    const errors = validate(roomName);
    if (errors.length === 0) {
      this.props.socketService.joinRoom({ roomName });
      this.props.history.push(`/${roomName}`);
    }
    this.props.setErrors({ errors });
  }

  getSanitizedRoomName() {
    return this.state.roomName.trim().toLowerCase();
  }

  render() {
    const { roomName } = this.state; // createNewRoom
    const { isCurrent } = this.props;
    return (
      <Slide>
        <Input
          type="text"
          value={roomName}
          placeholder="Enter Room Name"
          onChange={e => this.onChange(e)}
          onSubmit={e => this.onSubmit(e)}
          disabled={!isCurrent}
        />
      </Slide>
    );
  }
}

const LobbyWidget = withRouter(LobbyWidgetComponent);

export { LobbyWidget };