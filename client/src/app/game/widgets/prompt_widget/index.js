import React from 'react';
import PropTypes from "prop-types";

import { Slide } from '../index';

import Style from './style.module.css';

const SPEED = 12;

class PromptWidget extends React.Component {
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
    const { children } = this.props;
    this.setState({
      typed: typed + children[nextCharIndex],
    });
    if (nextCharIndex !== children.length - 1) {
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
    const { typed } = this.state;
    return (
      <Slide done={this.setState}>
        <p className={Style.prompt}>
          {typed}
        </p>
      </Slide>
    );
  }
}

PromptWidget.propTypes = {
  children: PropTypes.string,
  doneCallback: PropTypes.func
};

export { PromptWidget };