import React from 'react';

import Style from './style.module.css';


const Button = ({
  children,
  onClick,
  disabled
}) => (
  <button
    className={Style.button}
    // ref={(input) => { this.input = input; }} // this won't always be what we want to focus on 
    tabIndex={0}
    onClick={() => onClick()}
    disabled={disabled}
  >
    {children}
  </button>
);

export { Button }