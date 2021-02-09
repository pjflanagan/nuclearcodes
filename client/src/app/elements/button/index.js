import React from 'react';

import Style from './style.module.css';


const Button = ({
  children,
  onClick,
  disabled,
  ref
}) => (
  <button
    className={Style.button}
    ref={ref}
    tabIndex={0}
    onClick={() => onClick()}
    disabled={disabled}
  >
    {children}
  </button>
);

export { Button }