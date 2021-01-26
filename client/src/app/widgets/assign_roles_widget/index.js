import React from 'react';

import { Slide, Typeable, Text, Pill } from '../../elements';

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
    return (
      <Typeable doneTypingCallback={this.doneTypingCallback}>
        <Text>You are a</Text>
        <Pill color="red">SPY</Pill>
        <Text>along with:</Text>
        {
          this.props.gameState.players.filter(p => p.isSpy).map((p, i) => {
            <Pill key={i} color="red">{p.name}</Pill>
          })
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