import React from 'react';

import { Slide } from '../../elements';

import Style from './style.module.css';

const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9\-_]*$/;

class RoomWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerName: "",
      errors: []
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.input.focus();
  }

  onChange(e) {
    this.setState({
      playerName: e.target.value,
    });
  }

  onKeyDown(e) {
    if (e.key === 'Enter') {
      this.onSubmit();
    }
  }

  onSubmit() {
    const errors = this.validate();
    const { playerName } = this.state;
    if (errors.length === 0) {
      this.props.socketService.setPlayerName({ playerName });
      this.props.doneCallback({ playerName });
    }
    this.setState({
      errors
    });
  }


  validate() {
    const { playerName } = this.state;
    if (playerName.length === 0) {
      return ["Your name must contain at least 1 character."];
    }
    if (!playerName.match(ALPHANUMERIC_REGEX)) {
      return ["Your name must be alphanumeric and not contain spaces."];
    }
    return [];
  }


  render() {
    const { errors } = this.state;
    const { isCurrent } = this.props;
    return (
      <Slide>
        <input
          ref={(input) => { this.input = input; }}
          type="text"
          placeholder="Your Secret Agent Name"
          tabIndex={0}
          className={Style.input}
          onChange={e => this.onChange(e)}
          onKeyDown={e => this.onKeyDown(e)}
          disabled={!isCurrent}
        />
        <div className={Style.errors}>
          {
            errors.map(error => (<p>{error}</p>))
          }
        </div>
      </Slide>
    );
  }
}

export { RoomWidget };