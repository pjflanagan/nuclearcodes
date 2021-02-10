import React from 'react'

import { Slide } from '../../elements';

import Style from './style.module.css';
import Logo from './logo.png';

const { REACT_APP_SOCKET_ENDPOINT } = process.env;

class LogoWidget extends React.Component {
  constructor(props) {
    super(props);

    this.wakeServer = this.wakeServer.bind(this);
  }

  componentDidMount() {
    this.wakeServer();
    this.lodingMessageTimeout = setTimeout(() => {
      this.props.setErrors({ errors: ['Loading...'] });
    }, 2000)
  }

  wakeServer() {
    console.info(`Waking server at ${REACT_APP_SOCKET_ENDPOINT}.`);
    fetch(REACT_APP_SOCKET_ENDPOINT)
      .then(() => {
        console.info('Server is awake.');
        clearTimeout(this.lodingMessageTimeout);
        this.props.doneCallback({ success: true });
      }
      ).catch(() => {
        console.error('Failed to wake server.');
        clearTimeout(this.lodingMessageTimeout);
        setTimeout(() => {
          this.props.setErrors({ errors: ['Game server failed to start, please refresh page.'] });
        }, 2000);
      });
  }

  render() {
    return (
      <Slide>
        <div className={Style.logoHolder}>
          <img className={Style.logo} src={Logo} alt="Nuclear Codes Logo" />
        </div>
      </Slide>
    );
  }
}

export { LogoWidget }