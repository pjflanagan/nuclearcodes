import React from 'react';
import Cookies from 'universal-cookie';

import { Slide, Input } from '../../elements';

const COOKIE_NAME = 'NUCLEAR_CODES_PLAYER_NAME';
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
  return playerName.replace(' ', '');
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

  componentDidMount() {
    this.cookies = new Cookies();
    const playerNameFromCookie = this.cookies.get(COOKIE_NAME);
    console.log(playerNameFromCookie);
    if (!!playerNameFromCookie) {
      this.setState({
        playerName: playerNameFromCookie
      });
    }
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

      this.cookies.set(COOKIE_NAME, playerNameSanitized, { path: '/' });
    }
    this.props.setErrors({ errors });
  }


  render() {
    const { playerName } = this.state;
    const { isCurrent } = this.props;
    return (
      <Slide>
        <Input
          placeholder="Your Secret Agent Name"
          tabIndex={0}
          value={playerName}
          onChange={e => this.onChange(e)}
          onSubmit={e => this.onSubmit(e)}
          disabled={!isCurrent}
        />
      </Slide>
    );
  }
}

export { PlayerNameWidget };