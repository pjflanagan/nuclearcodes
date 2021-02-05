import React from 'react';

import { Player } from '../index';

import Style from './style.module.css'

const PlayerList = ({
  players,
  me,
  isCurrent,
  doNotShowSpies
}) => (
  <div className={Style.playerList}>
    {
      players.map((p, i) => (
        <Player
          key={i}
          me={me}
          doNotShowSpies={doNotShowSpies}
          doNotType={true}
          player={p}
          displayResponded={true}
          isCurrent={isCurrent}
        />
      ))
    }
  </div>
)

export { PlayerList }