import React from 'react';

import { SegmentedInput, Slide, Button, PlayerList } from '../../elements';
import { getMe } from '../../game/GameComponent';

import Style from './style.module.css';

// TODO: display this user's previous code

const validate = (code, codeLength) => {
  if (code.length < codeLength) {
    return [`Code must contain all ${codeLength} characters.`];
  }
  return [];
};

const sanitize = (values) => {
  return values.join('').toUpperCase();
};

class EnterCodeWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
      submitted: false,
      players: []
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.spySubmit = this.spySubmit.bind(this);
    this.updatePlayers = this.updatePlayers.bind(this);
  }

  componentDidMount() {
    const { gameState: { codeLength, players } } = this.props;
    this.setState({
      players,
      values: [...Array(codeLength)].fill('')
    });
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
      players
    });
  }

  onChange(fieldIndex, value) {
    const newValues = [...this.state.values];
    newValues[fieldIndex] = value;
    this.setState({
      values: newValues
    });
  }

  onSubmit(e) {
    const { gameState: { codeLength } } = this.props;
    const { values } = this.state;
    const code = sanitize(values);
    const errors = validate(code, codeLength);
    if (errors.length === 0) {
      this.props.socketService.pollResponse({
        type: 'ROUND_ENTER_CODE',
        data: { code }
      });
      this.setState({
        submitted: true
      });
    }
    this.props.setErrors({ errors });
  }

  spySubmit(e) {
    this.props.socketService.pollResponse({
      type: 'ROUND_ENTER_CODE',
      data: { code: 'FAKECODE' } // this will never be right because it has vowels
    });
    this.setState({
      submitted: true
    });
  }

  render() {
    const { submitted, values, players } = this.state;
    const { isCurrent, socketID } = this.props;
    const me = getMe(players, socketID);

    let content = (<></>);

    if (!!me && me.isSpy) {
      content = (
        <div className={Style.readyUpButtonHolder}>
          <Button
            onClick={this.spySubmit}
            disabled={submitted}
          >
            {`Spies don't submit codes, press here to fake submit`}
          </Button>
        </div>
      );
    } else {
      content = (
        <SegmentedInput
          disabled={!isCurrent || submitted}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          segments={values.length}
        />
      );
    }

    return (
      <Slide>
        <PlayerList me={me} players={players} />
        {content}
      </Slide>
    );
  }
}

export { EnterCodeWidget };