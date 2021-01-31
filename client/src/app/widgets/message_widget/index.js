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
  render() {
    // data: {"data":{"roomID":0,"realLetter":"J","fakeLetter":"Z","showWhichLetter":"REAL"}
    const { data, me } = this.props;
    // if a spy, highlight the letter with color,
    // if not a spy, present the letter truthfully
    let content = (<></>);
    if (data.showWhichLetter === 'BOTH') {
      content = (
        <Typeable doneTypingCallback={this.props.doneCallback}>
          <Text>{'You saw '}</Text>
          <Pill>{data.realLetter}</Pill>
          <Text>{' and '}</Text>
          <Pill color="red">{data.fakeLetter}</Pill>
          <Text>{' in room '}</Text>
          <Pill>{data.roomID + 1}</Pill>
          <Text>{'. You and your fellow spy should only mention seeing one of them, or you could make up a third fake letter. In the code field, enter an incorrect code.'}</Text>
        </Typeable>
      )
    } else {
      let prompt = (me.isSpy && data.showWhichLetter === 'FAKE') ?
        'Remember, your fellow roommate thinks this letter is real.' :
        'Talk it over and vote on a code to enter.'
      if (me.isSpy) {
        prompt += ' In the code field, enter an incorrect code.'
      }
      content = (
        <Typeable doneTypingCallback={this.props.doneCallback}>
          <Text>{'You saw '}</Text>
          <Pill color={me.isSpy && data.showWhichLetter === 'FAKE' ? 'red' : ''}>
            {
              data.showWhichLetter === 'FAKE' ? data.fakeLetter : data.realLetter
            }
          </Pill>
          <Text>{' in room '}</Text>
          <Pill>{data.roomID + 1}</Pill>
          <Text>{`. ${prompt}`}</Text>
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
        message = "which is typical of an American presidency, we still have some time."
        break;
      case 3:
        message = "which is not great, to say the least."
        break;
      case 4:
        message = "so, like, this is our last chance."
        break;
      default:
        break;
    }
    return (
      <Slide>
        <Typeable doneTypingCallback={this.props.doneCallback}>
          <Text>{`
            So the code you all agreed on was incorrect. 
            Remember, we need a majority to be correct in order to unlock the nuclear football.
            It looks like we're up to defcon `}</Text>
          <Pill>{this.props.gameState.round}</Pill>
          <Text>{` ${message}`}</Text>
        </Typeable>
      </Slide>
    )
  }
}

class MessageGameOver extends React.Component {
  render() {
    const { data: { result, code }, me } = this.props;
    let pill = (<></>)
    let message1 = '';
    let message2 = '';
    if (me.isSpy) {
      if (result === 'victory') {
        pill = (<Pill>{'DEFEAT'}</Pill>);
        message1 = 'Foiled, your treachery was no match for American enginuity. Our agents guessed '
        message2 = ' and put an end to your terrorist and/or communist plot.'
      } else {
        pill = (<Pill color="red">{'VICTORY'}</Pill>);
        message1 = 'Congrats, you managed to prevent our agents from guessing '
        message2 = " and with it, America, a beacon of hope to the world, has fallen. I hope you're happy."
      }
    } else {
      if (result === 'victory') {
        pill = (<Pill>{'VICTORY'}</Pill>);
        message1 = 'Congradulations, our agents guessed '
        message2 = ' and put an end to this evil scheme. Mission Accomplished!'
      } else {
        pill = (<Pill color="red">{'DEFEAT'}</Pill>);
        message1 = "It's over, the great American experiment crumbles before our eyes. All because we couldn't guess the right code:"
        message2 = ". You've let your country down."
      }
    }
    return (
      <Slide>
        <Typeable doneTypingCallback={this.props.doneCallback}>
          {pill}
          <Text>{`${message1}`}</Text>
          <Pill>{code}</Pill>
          <Text>{`${message2}`}</Text>
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
  MessageWidgetDefcon,
  MessageGameOver
};