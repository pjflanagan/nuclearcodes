
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
    const { disabled, placeholder, onChange, onSubmit, errors } = this.props;
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
        <div className={Style.errors}>
          {
            errors.map((error, i) => (
              <p key={i}>{error}</p>
            ))
          }
        </div>
      </div>
    );
  }
}


export { Input };