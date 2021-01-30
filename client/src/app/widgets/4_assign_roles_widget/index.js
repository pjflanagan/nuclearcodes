import React from 'react';

import { Slide, Typeable, Text, Pill, Player } from '../../elements';

const CHANGE_DELAY = 1000;

class AssignRolesWidget extends React.Component {
  constructor(props) {
    super(props);

    this.doneTypingCallback = this.doneTypingCallback.bind(this);
  }

  doneTypingCallback() {
    setTimeout(
      () => this.props.doneCallback(),
      CHANGE_DELAY
    );
  }

  spyContent() {
    const { me } = this.props;
    const spyPlayers = this.props.gameState.players.filter(p => p.isSpy && p.id !== me.id);
    return (
      <Typeable doneTypingCallback={this.doneTypingCallback}>
        <Text>You are a</Text>
        <Pill color="red">SPY</Pill>
        <Text>along with:</Text>
        {
          spyPlayers.map((p, i) => (
            <Player
              key={i}
              me={me}
              player={p}
            />
          ))
        }
      </Typeable>
    );
  }

  agentContent() {
    return (
      <Typeable doneTypingCallback={this.doneTypingCallback}>
        <Text>You are an</Text>
        <Pill>AGENT</Pill>
        <Text>, be on the lookout for spies.</Text>
      </Typeable>
    );
  }

  render() {
    const { me } = this.props;
    const content = me.isSpy ? this.spyContent() : this.agentContent();
    return (
      <Slide>
        { content}
      </Slide>
    );
  }
}

export { AssignRolesWidget };