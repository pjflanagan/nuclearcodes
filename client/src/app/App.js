import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { GameReducer } from '../reducers';
import { SocketService } from '../services';

import Style from './style.module.css';
import { Game } from './game';
import { Cover } from './elements';

class App extends React.Component {
  constructor() {
    super();

    this.store = createStore(GameReducer, composeWithDevTools(applyMiddleware(thunk)));
    this.store.dispatch(SocketService.startService()); // TODO: do this after server has been woken up
  }

  componentDidMount() {
    // fetch(); TODO: fetch backend to wake it up
    // TODO: maybe do this in the LOGO slide
  }

  render() {
    return (
      <Provider store={this.store}>
        <div className={Style.app}>
          <Cover />
          {/* Menu */}
          <Game socketService={SocketService} />
        </div>
      </Provider>
    );
  }
}

export { App };
