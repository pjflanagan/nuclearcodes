


import React from 'react';

import Style from './style.module.css';

class Toggle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLeftOption: true, // this will need to be a prop, and then this can be a function component
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle(isLeftOption) {
    // TODO: this will really need to be in the parent and passed in as a prop
    this.setState({
      isLeftOption
    });
  }

  render() {
    const { isLeftOption } = this.state;
    const { isCurrent, optionLeft, optionRight } = this.props;
    return (
      <div className={`${Style.toggle} ${!isCurrent ? Style.disabled : ''}`}>
        <div className={Style.optionsHolder}>
          <div
            className={`${Style.option} ${isLeftOption ? '' : Style.selected}`}
            onClick={() => this.toggle(false)}
          >
            {optionLeft}
          </div>
          <div
            className={`${Style.option} ${isLeftOption ? Style.selected : ''}`}
            onClick={() => this.toggle(true)}
          >
            {optionRight}
          </div>
        </div>
      </div>
    );
  }
}


export { Toggle };