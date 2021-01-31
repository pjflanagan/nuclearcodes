import React from 'react'

import { Slide } from '../../elements';

import Style from './style.module.css';

const { REACT_APP_SOCKET_ENDPOINT } = process.env;

class LogoWidget extends React.Component {
  constructor(props) {
    super(props);

    this.wakeServer = this.wakeServer.bind(this);
  }

  componentDidMount() {
    this.wakeServer();
  }

  wakeServer() {
    console.info(`Waking server at ${REACT_APP_SOCKET_ENDPOINT}.`);
    fetch(REACT_APP_SOCKET_ENDPOINT)
      .then(() => {
        console.info('Server is awake.');
        this.props.doneCallback({ success: true });
      }
      ).catch(() => {
        console.error('Failed to wake server.');
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