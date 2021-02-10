import React from 'react';

import { Slide, Typeable, Text, Pill, Player } from '../../elements';
import { GameWidget } from '../../game/';
import {
  RiSpyFill,
} from 'react-icons/ri'
import {
  FaIdBadge
} from 'react-icons/fa'

class AssignRolesWidget extends GameWidget {
  spyContent(me) {
    const spyPlayers = this.props.gameState.players.filter(p => p.isSpy && p.id !== me.id);
    return (
      <Typeable doneTypingCallback={this.props.doneCallback}>
        <Text>{'I guess you hate America. You are a'}</Text>
        <Pill color="red"><RiSpyFill />{'SPY'}</Pill>
        <Text>{'along with:'}</Text>
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
      <Typeable doneTypingCallback={this.props.doneCallback}>
        <Text>{'You are an'}</Text>
        <Pill><FaIdBadge />{'AGENT'}</Pill>
        <Text>{', try and guess the correct code and be on the lookout for spies.'}</Text>
      </Typeable>
    );
  }

  render() {
    const me = this.getMe();
    const content = me.isSpy ? this.spyContent(me) : this.agentContent();
    return (
      <Slide>
        { content}
      </Slide>
    );
  }
}

export { AssignRolesWidget };