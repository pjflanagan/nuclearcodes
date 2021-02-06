import React from 'react';

import { Slide, Title, Typeable, Text, Pill, PillCopy } from '../../elements';
import { GameWidget } from '../../game';

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

class MessageWidgetLetterReveal extends GameWidget {
  render() {
    // data: {"data":{"roomID":0,"realLetter":"J","fakeLetter":"Z"}
    const { data } = this.props;
    const me = this.getMe();
    // if a spy, highlight the letter with color,
    // if not a spy, present the letter truthfully
    let content = (<></>);
    if (!!me && me.isSpy) {
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
          <Text>{`. Talk it over and vote on a code to enter. Remember, the code changes every round.`}</Text>
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
    const { data: { guessedCode, charsCorrect } } = this.props;
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
          <Text>{"The majority voted for "}</Text>
          <Pill>{guessedCode}</Pill>
          <Text>{" which contained "}</Text>
          <Pill>{charsCorrect}</Pill>
          <Text>{`
            correct characters, and failed to unlock the nuclear football. 
            We've moved up to defcon `}</Text>
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
  MessageWidgetLetterReveal,
  MessageWidgetDefcon,
};