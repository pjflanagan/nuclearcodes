import React from 'react';

import Style from './style.module.css';

const Player = ({
  index,
  name,
}) => (
  <div className={Style.player}>
    <div className={Style.playerName}>
      {!!name ? name : `00${index}`}
    </div>
  </div>
);

export { Player }