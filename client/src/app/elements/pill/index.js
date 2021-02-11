import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  IoCopySharp,
  IoCheckmarkCircleSharp
} from 'react-icons/io5'

import Style from './style.module.css';

// Typeable
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
    const { children, color, doNotType } = this.props;
    const { isTyped } = this.state;
    if (isTyped || !!doNotType) {
      return (
        <span className={`${Style.pill} ${Style[color]}`}>
          {children}
        </span>
      );
    }
    return (
      <span></span>
    );
  }
}

class PillLink extends Pill {
  render() {
    const { children, color, doNotType, href } = this.props;
    const { isTyped } = this.state;

    if (isTyped || !!doNotType) {
      return (
        <a
          href={href}
          rel="noreferrer"
          target="_blank"
          title={children}
          className={Style.linkPill}
        >
          <span className={`${Style.pill} ${Style[color]}`}>
            {children}
          </span>
        </a>
      );
    }
    return (
      <span></span>
    );
  }

}

class PillCopy extends Pill {
  constructor(props) {
    super(props);

    this.state = {
      isTyped: false,
      copied: false
    }
  }

  render() {
    const { children, color, doNotType, copyText } = this.props;
    const { isTyped, copied } = this.state;

    const copyToClipboardText = (!!copyText) ? copyText : children;

    if (isTyped || !!doNotType) {
      return (
        <CopyToClipboard
          text={copyToClipboardText}
          onCopy={() => this.setState({ copied: true })}
        >
          <span className={`${Style.pill} ${Style[color]} ${Style.actionable}`}>
            {
              copied ? <IoCheckmarkCircleSharp /> : <IoCopySharp />
            }
            {children}
          </span>
        </CopyToClipboard>
      );
    }
    return (
      <span></span>
    );
  }
}

class Player extends Pill {
  render() {
    const { player, me, doNotType, displayResponded, doNotShowSpies } = this.props;
    const color = (!doNotShowSpies && me.isSpy && player.isSpy) ? 'red' : '';
    const { isTyped } = this.state;
    const className = (displayResponded && !!player.response) ? Style.responded : '';
    if (isTyped || !!doNotType) {
      return (
        <span className={`${Style.pill} ${Style[color]} ${className}`}>
          {!!player.name ? player.name : `???`}
        </span>
      );
    }
    return (
      <span></span>
    );
  }
};


export { Pill, PillCopy, PillLink, Player }