import React from 'react'

import { Slide } from '../../elements';

import Style from './style.module.css';

const { REACT_APP_SOCKET_ENDPOINT } = process.env;

class LogoWidget extends React.Component {
  constructor(props) {
    super(props);

    this.wakeServer = this.wakeServer.bind(this);
  }

  // TODO: wipe to reveal component
  componentDidMount() {
    setTimeout(() => this.wakeServer(), 600);
  }

  wakeServer() {
    console.log(`Waking server at ${REACT_APP_SOCKET_ENDPOINT}.`);
    fetch(REACT_APP_SOCKET_ENDPOINT)
      .then(() => {
        console.log('Server is awake.');
        this.props.doneCallback({ success: true });
      }
      ).catch(() => {
        console.log('Failed to wake server.');
        // this.props.doneCallback({ success: false });
      });
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