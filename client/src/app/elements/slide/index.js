

import React from 'react';

import Style from './style.module.css';

class Slide extends React.Component {
  render() {
    const {
      children
    } = this.props;

    return (
      <div className={`${Style.slide}`}>
        { children}
      </div>
    );
  }
}

export { Slide };