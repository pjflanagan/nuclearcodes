import React from 'react'

// default class for widgets to make player info part of the
// widget's state, not a global state

class GameWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      players: []
    };

    this.updateGameState = this.updateGameState.bind(this);
  }

  componentDidMount() {
    this.updateGameState();
  }

  // only update our local state if this element isCurrent
  // this way when we move slides the data doesn't vanish
  // for instance responses from players, change from spy to agent
  // remain in rooms
  componentDidUpdate(prevProps) {
    if (this.props.isCurrent && prevProps !== this.props) {
      this.updateGameState();
    }
  }

  // set the gamestate to the players
  updateGameState() {
    const { gameState: { players } } = this.props;
    this.setState({
      players,
    });
  }

  // provide a function to get me from the current state of players
  getMe() {
    const { players } = this.state;
    const { socketID } = this.props;
    return players.find(p => p.id === socketID) || {};
  }
}

// GameWidget.propTypes = {
//   socketID: Pro
// }

export { GameWidget }