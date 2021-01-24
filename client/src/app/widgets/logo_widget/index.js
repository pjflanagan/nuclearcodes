import React from 'react'

import { Slide } from '../../elements';

import Style from './style.module.css';

class LogoWidget extends React.Component {
  // TODO: wipe to reveal component
  componentDidMount() {
    setTimeout(() => this.props.doneCallback(), 1200);
  }

  render() {
    return (
      <Slide>
        <div className={Style.logoHolder}>
          <div className={Style.logo}>Nuclear Codes</div>
        </div>
      </Slide>
    );
  }
}

export { LogoWidget }