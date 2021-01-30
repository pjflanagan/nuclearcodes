
import React from 'react';

import Style from './style.module.css';

// "waiting for all players to turn keys"
// 8s timeout for spies

class KeyChoiceWidget extends React.Component {
  render() {
    return (
      <div className={Style.keyOptions}>
        <div className={Style.keyOption}>
          <div className={`${Style.key} ${Style.agentKey}`}></div>
        </div>
        <div className={Style.keyOption}>
          <div className={`${Style.key} ${Style.spyKey}`}></div>
        </div>
      </div>
    );
  }
}

export { KeyChoiceWidget }