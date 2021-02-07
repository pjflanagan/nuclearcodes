import React from 'react';

import { Slide, Input } from '../../elements';

const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9\-_]*$/;

const validate = (playerName) => {
  if (playerName.length === 0) {
    return ["Your name must contain at least 1 character."];
  }
  if (!playerName.match(ALPHANUMERIC_REGEX)) {
    return ["Your name must be alphanumeric and not contain spaces."];
  }
  return [];
}

const sanitize = (playerName) => {
  return playerName.trim();
}

class PlayerNameWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerName: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      playerName: e.target.value,
    });
  }

  onSubmit() {
    const { playerName } = this.state;
    const playerNameSanitized = sanitize(playerName);
    const errors = validate(playerNameSanitized);
    if (errors.length === 0) {
      this.props.socketService.setPlayerName({ playerName: playerNameSanitized });
      this.props.doneCallback({ playerName: playerNameSanitized });
    }
    this.props.setErrors({ errors });
  }


  render() {
    const { isCurrent } = this.props;
    return (
      <Slide isPrompt={true}>
        <Input
          placeholder="Your Secret Agent Name"
          tabIndex={0}
          onChange={e => this.onChange(e)}
          onSubmit={e => this.onSubmit(e)}
          disabled={!isCurrent}
        />
      </Slide>
    );
  }
}

export { PlayerNameWidget };