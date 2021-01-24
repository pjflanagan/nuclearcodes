import React from 'react'

import { Slide } from '../../elements';

import Style from './style.module.css';

class LogoWidget extends React.Component {
  // TODO: wipe to reveal component
  componentDidMount() {
    this.props.doneCallback();
  }

  render() {
    return (
      <Slide>
        <div className={Style.logo}>Nuclear Codes</div>
      </Slide>
    );
  }
}

export { LogoWidget }