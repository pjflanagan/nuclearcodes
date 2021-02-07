

import React from 'react';

import Style from './style.module.css';

class Slide extends React.Component {
  render() {
    const {
      children,
      isPrompt
    } = this.props;

    const className = !!isPrompt ? Style.prompt : ''

    return (
      <div className={`${Style.slide} ${className}`}>
        { children}
      </div>
    );
  }
}

export { Slide };