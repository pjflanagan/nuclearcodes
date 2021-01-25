
import React from 'react';

import { Slide } from '../../elements';

import Style from './style.module.css';

// TODO: should game rooms be lowercase?
const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9\-_]*$/;

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

  componentDidMount() {
    this.input.focus();
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
    const errors = this.validate();
    const { roomName } = this.state;
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

  validate() {
    const { roomName } = this.state;
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
        <input
          ref={(input) => { this.input = input; }}
          type="text"
          placeholder="Enter Room Name"
          tabIndex={0}
          className={Style.input}
          onChange={e => this.onChange(e)}
          onKeyDown={e => this.onKeyDown(e)}
          disabled={!isCurrent}
        />
        <div className={Style.errors}>
          {
            errors.map((error, i) => (
              <p key={i}>{error}</p>
            ))
          }
        </div>
      </Slide>
    );
  }
}

export { LobbyWidget };