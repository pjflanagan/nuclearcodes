import React from 'react';

import Style from './style.module.css';

// TODO: if a spy, highlight the players that are spies
// if this is you, highlight that with a border
// if the players a ready-ing up, or something, highlight that

const Player = ({
  index,
  player
}) => (
  <div className={Style.player}>
    <div className={Style.playerName}>
      {!!player.name ? player.name : `00${index}`}
    </div>
  </div>
);

export { Player }