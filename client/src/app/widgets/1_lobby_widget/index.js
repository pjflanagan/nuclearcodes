
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
  // TODO: if joining but room doesn't exist, prompt them to create a new room
  // if creating room already exists, prompt them to joing
  return [];
}

class LobbyWidgetComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // createNewRoom: false,
      roomName: "",
      errors: []
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
    this.setState({
      errors
    });
  }

  getSanitizedRoomName() {
    return this.state.roomName.trim().toLowerCase();
  }

  render() {
    // TODO: append game errors here too
    const { errors, roomName } = this.state; // createNewRoom
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
          errors={errors}
        />
      </Slide>
    );
  }
}

const LobbyWidget = withRouter(LobbyWidgetComponent);

export { LobbyWidget };