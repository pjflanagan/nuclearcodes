import React from 'react';

import { Slide, Title, Typeable, Text, Pill, PillCopy, Player } from '../../elements';

class MessageWidget extends React.Component {
  render() {
    return (
      <Slide>
        {!!this.props.data.title && <Title>{this.props.data.title}</Title>}
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
        <Title>{'Begin Transmission'}</Title>
        <Typeable doneTypingCallback={this.props.doneCallback}>
          <Text>{'Welcome to Briefing Room '}</Text>
          <Pill>{roomName}</Pill>
          <Text>{' agent '}</Text>
          <Pill>{playerName}</Pill>
          <Text>{'. You can invite friends to this game by sharing the url: '}</Text>
          <PillCopy>{window.location.href}</PillCopy>
        </Typeable>
      </Slide>
    );
  }
}

class MessageWidgetKeyRoom extends React.Component {
  render() {
    const { data, me } = this.props;
    const prompt = (!me.isSpy) ?
      'waiting for all rooms to turn their keys' :
      'choose which key to turn';
    const otherPlayerArr = data.room.filter(p => p.id !== me.id);
    const otherPlayer = (!!otherPlayerArr[0]) ? otherPlayerArr[0] : {}; // players.find(p => p.id === otherPlayerArr[0].id)
    return (
      <Slide>
        <Title>{'Key Room'}</Title>
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
    // data: {"data":{"roomID":0,"realLetter":"J","fakeLetter":"Z"}
    const { data, me } = this.props;
    // if a spy, highlight the letter with color,
    // if not a spy, present the letter truthfully
    let content = (<></>);
    if (me.isSpy) {
      content = (
        <Typeable doneTypingCallback={this.props.doneCallback}>
          <Text>{'You saw '}</Text>
          <Pill>{data.realLetter}</Pill>
          <Text>{' and '}</Text>
          <Pill color="red">{data.fakeLetter}</Pill>
          <Text>{' in room '}</Text>
          <Pill>{data.roomID + 1}</Pill>
          <Text>{'. You my choose to lie and accuse your roommate of being a spy.'}</Text>
        </Typeable>
      )
    } else {
      content = (
        <Typeable doneTypingCallback={this.props.doneCallback}>
          <Text>{'You saw '}</Text>
          <Pill>{data.realLetter}</Pill>
          <Text>{' in room '}</Text>
          <Pill>{data.roomID + 1}</Pill>
          <Text>{`. Talk it over and vote on a code to enter.`}</Text>
        </Typeable>
      );
    }
    return (
      <Slide>
        <Title>{'Code Entry'}</Title>
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
        message = "which is typical of a post-Reagan presidency, we still have some time."
        break;
      case 3:
        message = "which is not great, we're never going to hear the end of this at the next UN conference."
        break;
      case 4:
        message = "so, like, this is our last chance. The fate of a nation rests in your hands."
        break;
      default:
        break;
    }
    return (
      <Slide>
        <Title>{'Code Entry Result'}</Title>
        <Typeable doneTypingCallback={this.props.doneCallback}>
          <Text>{`
            So the code you agreed on was incorrect. 
            Remember, we need a majority to be correct in order to unlock the nuclear football. 
            We've moved up to defcon `}</Text>
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
        message1 = ' , your treachery was no match for American ingenuity. Our agents guessed '
        message2 = ' and foiled your terrorist and/or communist plot.'
      } else {
        pill = (<Pill color="red">{'VICTORY'}</Pill>);
        message1 = ' Nice going, you managed to prevent our agents from guessing the code: '
        message2 = ". And in one fell swoop, America, a beacon of hope to the world, has fallen. I hope you're happy."
      }
    } else {
      if (result === 'victory') {
        pill = (<Pill>{'VICTORY'}</Pill>);
        message1 = ' Congratulations, our agents guessed '
        message2 = ' and put an end to this terrorist and/or communist scheme. Mission Accomplished!'
      } else {
        pill = (<Pill color="red">{'DEFEAT'}</Pill>);
        message1 = " It's over, the great American experiment has crumbled before our eyes. All because we couldn't guess the right code: "
        message2 = ". You've let your nation down."
      }
    }
    return (
      <Slide>
        <Title>{'Game Over'}</Title>
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