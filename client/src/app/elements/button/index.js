import React from 'react';

import Style from './style.module.css';


const Button = ({
  children,
  onClick,
  disabled
}) => (
  <button
    className={Style.button}
    // TODO: this won't always be what we want to focus on ref={(input) => { this.input = input; }}
    tabIndex={0}
    onClick={() => onClick()}
    disabled={disabled}
  >
    {children}
  </button>
);

export { Button }