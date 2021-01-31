import React from 'react';

import { SegmentedInput, Slide } from '../../elements';

const CODE_LENGTH = 5;

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
      errors: [],
      submitted: false
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // TODO: maybe should be moved into the SegmentedInput element
  componentDidMount() {
    this.mountTimestamp = new Date().getTime();
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
    this.setState({
      errors
    });
  }

  render() {
    const { errors, submitted } = this.state;
    const { isCurrent } = this.props;
    return (
      <Slide>
        <SegmentedInput
          disabled={!isCurrent || submitted}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          errors={errors}
          segments={CODE_LENGTH}
          name={`Round${this.mountTimestamp}`} // ensures uniquness
        />
      </Slide>
    );
  }
}

export { EnterCodeWidget };