import React from 'react';

import { Slide, Typeable, Text, Pill, Player } from '../../elements';

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

class MessageWidgetWelcome extends React.Component {
  render() {
    const { playerName, roomName } = this.props.data;
    return (
      <Slide>
        <Typeable doneTypingCallback={this.props.doneCallback}>
          <Text>{'Welcome to Briefing Room '}</Text>
          <Pill>{roomName}</Pill>
          <Text>{' agent '}</Text>
          <Pill>{playerName}</Pill>
          <Text>{'. You can invite friends to this game by sharing the url: '}</Text>
          <Pill copyable={true}>{window.location.href}</Pill>
        </Typeable>
      </Slide>
    );
  }
}

class MessageWidgetKeyRoom extends React.Component {
  render() {
    const { data, me } = this.props;
    const prompt = (!me.isSpy) ?
      'waiting for all rooms to turn thier keys' :
      'choose which key to turn';
    const otherPlayerArr = data.room.filter(p => p !== me.id);
    const otherPlayer = (!!otherPlayerArr[0]) ? otherPlayerArr[0] : {};
    return (
      <Slide>
        <Typeable doneTypingCallback={() => this.props.doneCallback({ isSpy: me.isSpy })}>
          <Text>{'You are in room '}</Text>
          <Pill>{data.roomID + 1}</Pill>
          <Text>{' with '}</Text>
          <Player
            me={me}
            player={otherPlayer}
          />
          <Text>{`, ${prompt}.`}</Text>
        </Typeable>
      </Slide>
    )
  }
}

class MessageWidgetLetterReveal extends React.Component {

  render() {
    // data: {"data":{"roomID":0,"realLetter":"J","fakeLetter":"Z","showWhichLetter":"REAL"}
    const { data, me } = this.props;
    console.log({ data });
    // TODO: if a spy, highlight the letter with color,
    // if not a spy, present the letter truthfully
    // 
    return (
      <Slide>
        <Typeable doneTypingCallback={this.props.doneCallback}>
          <Text>{'You saw '}</Text>
          <Pill></Pill>
          <Text>{' in room '}</Text>
          <Pill>{data.roomID + 1}</Pill>
          {/* ...  */}
          <Text>{'. Talk it over and vote on a code to enter.'}</Text>
        </Typeable>
      </Slide>
    );
  }
}

export {
  MessageWidget,
  MessageWidgetWelcome,
  MessageWidgetKeyRoom,
  MessageWidgetLetterReveal
};