import React from 'react'

import Style from './style.module.css';

class LogoWidget extends React.Component {
  // TODO: wipe to reveal component
  componentDidMount() {
    this.props.doneCallback();
  }

  render() {
    return (
      <div className={Style.logo}>Nuclear Codes</div>
    );
  }
}

export { LogoWidget }