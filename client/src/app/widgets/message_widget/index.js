import React from 'react';

import { Slide, Typeable, Text, Pill } from '../../elements';

class MessageWidget extends React.Component {
  render() {
    return (
      <Slide>
        <Typeable doneTypingCallback={this.props.doneCallback}>
          <Text>
            {this.props.data.text}
          </Text>
        </Typeable>
      </Slide>
    );
  }
}

class MessageWidgetLobby extends React.Component {
  render() {
    const { roomName } = this.props.data;
    return (
      <Slide>
        <Typeable doneTypingCallback={this.props.doneCallback}>
          <Text>{`Welcome to Briefing Room ${roomName}. You can invite friends to this game by sharing the url: `}</Text>
          <Pill>{window.location.href}</Pill>
        </Typeable>
      </Slide>
    );
  }
}

class MessageWidgetName extends React.Component {
  render() {
    const { playerName } = this.props.data;
    return (
      <Slide>
        <Typeable doneTypingCallback={this.props.doneCallback}>
          <Text>{'Welcome Agent '}</Text>
          <Pill>{playerName}</Pill>
        </Typeable>
      </Slide>
    );
  }
}

export { MessageWidget, MessageWidgetLobby, MessageWidgetName };