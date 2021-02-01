
import React from 'react';

import { Button } from '../button';

import Style from './style.module.css';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    this.input.focus();
  }

  onKeyDown(e) {
    if (e.key === 'Enter') {
      this.props.onSubmit();
    }
  }

  render() {
    const { disabled, placeholder, onChange, onSubmit } = this.props;
    return (
      <div className={Style.inputRow}>
        <div className={Style.inputHolder}>
          <input
            ref={(input) => { this.input = input; }}
            type="text"
            value={this.props.value}
            placeholder={placeholder}
            tabIndex={0}
            className={Style.input}
            onChange={e => onChange(e)}
            onKeyDown={e => this.onKeyDown(e)}
            disabled={disabled}
          />

        </div>
        <div className={Style.buttonHolder}>
          <Button
            onClick={e => onSubmit(e)}
            disabled={disabled}
          >
            {'Enter'}
          </Button>
        </div>
      </div>
    );
  }
}

const getFieldIndexFromName = (name) => {
  // eslint-disable-next-line
  const [fieldName, fieldIndex] = name.split("-");
  const fieldIndexInt = parseInt(fieldIndex, 10);
  return fieldIndexInt;
}

class SegmentedInput extends React.Component {
  constructor(props) {
    super(props);

    this.focusSegment = this.focusSegment.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    this.mountTimestamp = new Date().getTime();
    this.focusSegment(0);
  }

  focusSegment(i) {
    const nextSibling = document.querySelector(
      `input[name=seg${this.mountTimestamp}-${i}]`
    );

    // If found, focus the next field
    if (nextSibling !== null) {
      nextSibling.focus();
    }
  }

  onChange(e) {
    const { maxLength, value, name } = e.target;
    const fieldIndex = getFieldIndexFromName(name);

    // Check if they hit the max character length
    if (value.length >= maxLength) {
      // Check if it's not the last input field
      if (fieldIndex < this.props.segments) {
        // Get the next input field
        this.focusSegment(fieldIndex + 1);
      }
    }
    this.props.onChange(fieldIndex, value)
  }

  onKeyDown(e) {
    if (e.key === 'Enter') {
      this.props.onSubmit();
    }
    // TODO: select backward on delete
    // else if (e.key === 'Backspace') {
    //   const { name } = e.target;
    //   const fieldIndex = getFieldIndexFromName(name);
    //   this.focusSegment(fieldIndex - 1);
    // }
  }

  render() {
    const { disabled, onSubmit, segments } = this.props;
    return (
      <div className={Style.inputRow}>
        <div className={Style.inputHolder}>
          {
            [...Array(segments)].map((a, i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                name={`seg${this.mountTimestamp}-${i}`}
                value={this.props.value}
                placeholder={i + 1}
                tabIndex={0}
                className={`${Style.input} ${Style.inputSegment}`}
                style={{
                  width: `calc(${100 / segments}% - 8px)`
                }}
                onChange={e => this.onChange(e)}
                onKeyDown={e => this.onKeyDown(e)}
                disabled={disabled}
              />
            ))
          }
        </div>

        <div className={Style.buttonHolder}>
          <Button
            onClick={e => onSubmit(e)}
            disabled={disabled}
          >
            {'Enter'}
          </Button>
        </div>
      </div>
    );
  }
}


export { Input, SegmentedInput };