import React from 'react';

import { SlideComponent } from '../../slide_component';

import Style from './style.module.css';

const SPEED = 26;

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
    this.type(0);
  }

  type(nextCharIndex) {
    clearTimeout(this.timeoutID);
    const typed = nextCharIndex === 0 ? "" : this.state.typed;
    const { text } = this.props.data;
    this.setState({
      typed: typed + text[nextCharIndex],
    });
    if (nextCharIndex !== text.length - 1) {
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
      <SlideComponent done={done}>
        <p className={Style.message}>
          {typed}
        </p>
      </SlideComponent>
    );
  }
}

export { MessageWidget };