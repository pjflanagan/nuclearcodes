
// TODO: a component just for the styles and animations mostly

import React from 'react';

import Style from './style.module.css';

class SlideComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      done,
      children
    } = this.props;

    const className = done ? Style.done : '';
    return (
      <div className={`${Style.slide} ${className}`}>
        { children}
      </div>
    );
  }
}

export { SlideComponent };