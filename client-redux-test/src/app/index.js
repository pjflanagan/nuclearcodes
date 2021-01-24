import React from 'react';

import { Socket } from '../helpers';

import Style from './style.module.css';
import { Game } from './game';
import { Cover } from './elements';

class App extends React.Component {
  constructor(props) {
    super(props);

    // socket will hold user and isHost
    // user in state is for display
    this.socket = {};

    this.state = {
      user: {},
      gameState: {}
    }
  }

  componentDidMount() {
    this.socket = new Socket();
  }

  render() {
    return (
      <div className={Style.app}>
        <Cover />
        {/* Menu */}
        <Game />
      </div>
    );
  }
}

export { App };
