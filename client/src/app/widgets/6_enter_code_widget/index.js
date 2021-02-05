import React from 'react';

import { SegmentedInput, Slide } from '../../elements';

const CODE_LENGTH = 5;

// TODO: display previous code
// TODO: spies just have a button and cannot enter a code

const validate = (code) => {
  if (code.length < CODE_LENGTH) {
    return ["Code must contain all 5 characters."];
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
      values: [...Array(CODE_LENGTH)].fill(''),
      submitted: false
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(fieldIndex, value) {
    const newValues = [...this.state.values];
    newValues[fieldIndex] = value;
    this.setState({
      values: newValues
    });
  }

  onSubmit(e) {
    const { values } = this.state;
    const code = sanitize(values);
    const errors = validate(code);
    if (errors.length === 0) {
      this.props.socketService.pollResponse({
        type: 'ROUND_ENTER_CODE',
        data: { code }
      });
      this.setState({
        submitted: true
      })
    }
    this.props.setErrors({ errors });
  }

  render() {
    const { submitted } = this.state;
    const { isCurrent } = this.props;
    return (
      <Slide>
        <SegmentedInput
          disabled={!isCurrent || submitted}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          segments={CODE_LENGTH}
        />
      </Slide>
    );
  }
}

export { EnterCodeWidget };