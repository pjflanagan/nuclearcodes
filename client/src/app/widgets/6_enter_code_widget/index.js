import React from 'react';

import { SegmentedInput, Slide, PlayerList } from '../../elements';
import { GameWidget } from '../../game';

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
    const { submitted, players } = this.state;
    const { isCurrent, gameState: { codeLength } } = this.props;
    const me = this.getMe();

    const submitCallback = (!!me && me.isSpy) ? this.spySubmit : this.onSubmit;

    return (
      <Slide>
        <PlayerList me={me} players={players} isCurrent={isCurrent} />
        <SegmentedInput
          placeholder={DEFAULT_PLACEHOLDER}
          disabled={!isCurrent || submitted}
          onChange={this.onChange}
          onSubmit={submitCallback}
          segments={codeLength}
        />
      </Slide>
    );
  }
}

export { EnterCodeWidget };