import React from 'react'

import { Slide } from '../../elements';

import Style from './style.module.css';
import Logo from './logo.png';

const { REACT_APP_SOCKET_ENDPOINT } = process.env;

class LogoWidget extends React.Component {
  constructor(props) {
    super(props);

    this.wakeServer = this.wakeServer.bind(this);
    this.wakeServerRepeatedly = this.wakeServerRepeatedly.bind(this);
  }

  componentDidMount() {
    this.wakeServer();
    this.lodingMessageTimeout = setTimeout(() => {
      this.props.setErrors({ errors: ['Loading...'] });
    }, 2000);
  }

  // fetch the server to wake it
  // heroku free dyno goes to sleep after inactivity
  wakeServer() {
    console.info(`Waking server at ${REACT_APP_SOCKET_ENDPOINT}.`);
    fetch(REACT_APP_SOCKET_ENDPOINT)
      .then(() => {
        console.info('Server is awake.');
        clearTimeout(this.lodingMessageTimeout);
        // if the game starts, start a wake server repeatedly loop
        this.wakeServerRepeatedly();
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

  // every 8 minutes fetch the server again to keep it awake while playing
  // heroku free dyno goes to sleep if no 'web' request for 30 mins (socket does not count)
  wakeServerRepeatedly() {
    this.wakeServerInterval = setInterval(() => {
      console.info(`Ping server at ${REACT_APP_SOCKET_ENDPOINT}.`);
      fetch(REACT_APP_SOCKET_ENDPOINT)
        .then(() => {
          console.log('Server is awake.');
        })
        .catch(() => {
          console.error('Game server crash.');
          clearTimeout(this.wakeServerInterval);
          this.props.setErrors({ errors: ['Sorry, the game server has gone down, please refresh page.'] });
        });
    }, 1000 * 60 * 8);
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