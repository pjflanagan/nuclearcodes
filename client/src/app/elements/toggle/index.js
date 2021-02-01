


import React from 'react';

import Style from './style.module.css';

class Toggle extends React.Component {
  render() {
    const { isCurrent, optionLeft, optionRight, isLeftOption, onToggle } = this.props;
    return (
      <div className={`${Style.toggle} ${!isCurrent ? Style.disabled : ''}`}>
        <div className={Style.optionsHolder}>
          <div
            className={`${Style.option} ${isLeftOption ? '' : Style.selected}`}
            onClick={(e) => onToggle(false)}
          >
            {optionLeft}
          </div>
          <div
            className={`${Style.option} ${isLeftOption ? Style.selected : ''}`}
            onClick={(e) => onToggle(true)}
          >
            {optionRight}
          </div>
        </div>
      </div>
    );
  }
}


export { Toggle };