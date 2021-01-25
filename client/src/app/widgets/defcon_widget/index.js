import React from 'react';

import { Slide } from '../../elements';

import Style from './style.module.css';

const CHANGE_DELAY = 1000;

class AssignRolesWidget extends React.Component {

  componentDidMount() {
    setTimeout(
      () => this.props.doneCallback(),
      CHANGE_DELAY
    );
  }

  render() {
    return (
      <Slide>
        <div className={Style.circle}>
          <div className={Style.dotsHolder}>
            {[...Array(5)].map((e, i) => (
              <div key={i} className={Style.dot} />
            ))}
          </div>
          <div className={Style.midnight}></div>
          <div className={Style.secondHand}></div>
        </div>
      </Slide>
    );
  }
}

export { AssignRolesWidget };