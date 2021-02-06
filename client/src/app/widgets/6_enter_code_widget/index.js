import React from 'react';

import { SegmentedInput, Slide, Button, PlayerList } from '../../elements';
import { GameWidget } from '../../game';

import Style from './style.module.css';

const validate = (code, codeLength) => {
  if (code.length < codeLength) {
    return [`Code must contain all ${codeLength} characters.`];
  }
  return [];
};

const sanitize = (values) => {
  return values.join('').toUpperCase();
};

const DEFAULT_PLACEHOLDER = '??????????';

class EnterCodeWidget extends GameWidget {
  constructor(props) {
    super(props);
    this.state = {
      values: [],
      submitted: false,
      players: [],
      placeholder: DEFAULT_PLACEHOLDER
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.spySubmit = this.spySubmit.bind(this);
  }

  componentDidMount() {
    const { gameState: { codeLength, players } } = this.props;
    this.setState({
      players,
      values: [...Array(codeLength)].fill('')
    }, () => {
      // after the players have been set, getMe can be run
      // set the placeholder here
      const me = this.getMe();
      const placeholder = (!!me && !!me.prevCode && me.prevCode !== '') ? me.prevCode : DEFAULT_PLACEHOLDER;
      this.setState({
        placeholder,
      })
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
      data: { code: DEFAULT_PLACEHOLDER } // spy response is ignored
    });
    this.setState({
      submitted: true
    });
  }

  render() {
    const { submitted, players, placeholder } = this.state;
    const { isCurrent, gameState: { codeLength } } = this.props;
    const me = this.getMe();

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
          placeholder={placeholder}
          disabled={!isCurrent || submitted}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          segments={codeLength}
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