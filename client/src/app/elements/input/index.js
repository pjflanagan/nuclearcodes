
import React from 'react';

import Style from './style.module.css';

class Input extends React.Component {
  componentDidMount() {
    this.input.focus();
  }

  render() {
    const { disabled, placeholder, onChange, onKeyDown, errors } = this.props;
    return (
      <div>
        <input
          ref={(input) => { this.input = input; }}
          type="text"
          value={this.props.value}
          placeholder={placeholder}
          tabIndex={0}
          className={Style.input}
          onChange={e => onChange(e)}
          onKeyDown={e => onKeyDown(e)}
          disabled={disabled}
        />
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