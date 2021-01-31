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
    const otherPlayerArr = data.room.filter(p => p.id !== me.id);
    const otherPlayer = (!!otherPlayerArr[0]) ? otherPlayerArr[0] : {}; // players.find(p => p.id === otherPlayerArr[0].id)
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
  constructor(props) {
    super(props);
    this.doneCallback = this.doneCallback.bind(this);
  }

  doneCallback() {
    setTimeout(() => {
      this.props.doneCallback()
    }, 1000);
  }

  render() {
    // data: {"data":{"roomID":0,"realLetter":"J","fakeLetter":"Z","showWhichLetter":"REAL"}
    const { data, me } = this.props;
    // TODO: if a spy, highlight the letter with color,
    // if not a spy, present the letter truthfully
    let content = (<></>);
    if (data.showWhichLetter === 'BOTH') {
      content = (
        <Typeable doneTypingCallback={this.doneCallback}>
          <Text>{'You saw '}</Text>
          <Pill>{data.realLetter}</Pill>
          <Text>{' and '}</Text>
          <Pill color="red">{data.fakeLetter}</Pill>
          <Text>{' in room '}</Text>
          <Pill>{data.roomID + 1}</Pill>
          {/* ...  */}
          <Text>{'. You and your fellow spy should only mention seeing one of them, or you could make up a third fake letter.'}</Text>
        </Typeable>
      )
    } else {
      const prompt = (me.isSpy && data.showWhichLetter === 'FAKE') ?
        'Remember, your fellow roommate thinks this letter is real' :
        'Talk it over and vote on a code to enter'
      content = (
        <Typeable doneTypingCallback={this.doneCallback}>
          <Text>{'You saw '}</Text>
          <Pill color={me.isSpy && data.showWhichLetter === 'FAKE' ? 'red' : ''}>
            {
              data.showWhichLetter === 'FAKE' ? data.fakeLetter : data.realLetter
            }
          </Pill>
          <Text>{' in room '}</Text>
          <Pill>{data.roomID + 1}</Pill>
          <Text>{`. ${prompt}.`}</Text>
        </Typeable>
      );
    }
    return (
      <Slide>
        {content}
      </Slide>
    );
  }
}

class MessageWidgetDefcon extends React.Component {
  render() {
    let message = '';
    switch (this.props.gameState.round) {
      case 1:
        message = "and that's okay, let's just try and not let it go any higher."
        break;
      case 2:
        message = "and while this certanly isn't ideal, we still have some time."
        break;
      case 3:
        message = "which is not great."
        break;
      case 4:
        message = "so, like, this is our last chance."
        break;
    }
    return (
      <Slide>
        <Typeable doneTypingCallback={this.props.doneCallback}>
          <Text>{`
            So the code you all agreed on was incorrect. 
            Remember the one the system takes is the most entered code.
            It looks like we're up to defcon `}</Text>
          <Pill>{this.props.gameState.round}</Pill>
          <Text>{` ${message}`}</Text>
        </Typeable>
      </Slide>
    )
  }
}

export {
  MessageWidget,
  MessageWidgetWelcome,
  MessageWidgetKeyRoom,
  MessageWidgetLetterReveal,
  MessageWidgetDefcon
};