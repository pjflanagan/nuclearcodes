
import { GAMEPLAY } from './gameplay';

const getNextPlay = (nextPlayID, prevData = {}) => {
  const play = GAMEPLAY.find(play => play.id === nextPlayID);

  if (!play) {
    console.error(`Cannot find ${nextPlayID} in GAMEPLAY`);
    return GAMEPLAY.find(play => play.id === 'error')
  }

  if (!!play.data) {
    Object.assign(play.data, prevData);
  } else {
    play.data = prevData;
  }

  return play;
};

export { GAMEPLAY, getNextPlay };