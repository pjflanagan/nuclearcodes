import React from 'react'

import Style from './style.module.css';

class Typeable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      childTyping: -1
    }

    this.reportDoneCallback = this.reportDoneCallback.bind(this);
  }

  componentDidMount() {
    this.setState({
      childTyping: 0
    });
  }

  reportDoneCallback() {
    const { childTyping } = this.state;
    const { children } = this.props;
    const length = React.Children.toArray(children).length;

    const nextChildTyping = childTyping + 1;
    if (nextChildTyping >= length) {
      console.log("doneTypingCallback");
      this.props.doneTypingCallback();
    }

    this.setState({
      childTyping: nextChildTyping
    });
  }

  render() {
    const { childTyping } = this.state;
    const { children } = this.props;

    const childrenWithProps = React.Children.map(children, (child, i) => {
      if (React.isValidElement(child)) {
        return new React.cloneElement(child, {
          reportDoneCallback: () => this.reportDoneCallback(),
          isTyping: childTyping === i
        });
      }
      return child;
    });

    return (
      <p className={Style.typeable}>
        {childrenWithProps}
      </p>
    );
  }

}

const SPEED = 8;

class Text extends React.Component {
  constructor(props) {
    super(props);
    this.timeoutID = 0;

    this.state = {
      typed: ""
    }

    this.type = this.type.bind(this);
  }


  componentDidUpdate(prevProps) {
    if (!prevProps.isTyping && this.props.isTyping) {
      this.type(0);
    }
  }

  type(nextCharIndex) {
    const { children } = this.props;

    clearTimeout(this.timeoutID);

    const typed = nextCharIndex === 0 ? "" : this.state.typed;
    this.setState({
      typed: typed + children[nextCharIndex],
    });

    if (nextCharIndex !== children.length - 1) {
      this.timeoutID = setTimeout(() => this.type(nextCharIndex + 1), SPEED);
    } else {
      this.props.reportDoneCallback();
    }
  }

  render() {
    const { typed } = this.state;
    return (
      <span className={Style.text}>{typed}</span>
    );
  }
}

class Pill extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isTyped: false
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isTyping && this.props.isTyping) {
      this.setState({
        isTyped: true
      });
      this.props.reportDoneCallback();
    }
  }

  render() {
    const { children } = this.props;
    const { isTyped } = this.state;
    if (!isTyped) {
      return <span></span>
    }
    return (
      <span className={Style.pill}>
        {children}
      </span>
    );
  }
}

export {
  Typeable,
  Text,
  Pill
}