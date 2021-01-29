import React from 'react';

import { Slide } from '../../elements';

import Style from './style.module.css';

class ChooseRoomWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Slide>
        <div className={Style.roomRow}>
          {[...Array(5)].map((a, i) => (
            <div className={Style.room}>
              {i}
            </div>
          ))}
        </div>
      </Slide>
    );
  }
}

export { ChooseRoomWidget }