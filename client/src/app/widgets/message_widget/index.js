import React from 'react';

import { Slide } from '../../elements';

import Style from './style.module.css';

const SPEED = 8;

class MessageWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      done: false,
      typed: "",
    };

    this.timeoutID = 0;

    this.type = this.type.bind(this);
    this.done = this.done.bind(this);
  }

  componentDidMount() {
    // TODO: don't do this, extend the component with other components
    this.text = this.props.data.text
    this.type(0);
  }

  type(nextCharIndex) {
    clearTimeout(this.timeoutID);
    const typed = nextCharIndex === 0 ? "" : this.state.typed;
    this.setState({
      typed: typed + this.text[nextCharIndex],
    });
    if (nextCharIndex !== this.text.length - 1) {
      this.timeoutID = setTimeout(() => this.type(nextCharIndex + 1), SPEED);
    } else {
      this.done();
    }
  }

  done() {
    this.setState({ done: true });
    this.props.doneCallback();
  }

  render() {
    const { typed, done } = this.state;
    return (
      <Slide done={done}>
        <p className={Style.message}>
          {typed}
        </p>
      </Slide>
    );
  }
}

class MessageWidgetLobby extends MessageWidget {
  componentDidMount() {
    const { roomName } = this.props.data;
    this.text = `Welcome to Briefing Room ${roomName}. You can invite friends to this game by sharing the url:`
    this.type(0);
  }

  render() {
    const { typed, done } = this.state;
    const { roomName } = this.props.data;
    return (
      <Slide done={done}>
        <p className={Style.message}>
          {typed}
        </p>
        { done && <p className={Style.url}>
          {`nuclear-codes.com/${roomName}`}
        </p>}
      </Slide>
    );
  }
}

class MessageWidgetName extends MessageWidget {
  componentDidMount() {
    const { playerName } = this.props.data;
    this.text = `Welcome Agent ${playerName}.`
    this.type(0);
  }
}

export { MessageWidget, MessageWidgetLobby, MessageWidgetName };