import React from 'react';

import Style from './style.module.css';

const Player = ({
  id,
  name,
}) => (
  <div className={Style.player}>
    { !!name ? name : ''}
  </div>
);

export { Player }