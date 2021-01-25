import React from 'react';

import { Slide } from '../../elements';

import Style from './style.module.css';

const CHANGE_DELAY = 1000;

class AssignRolesWidget extends React.Component {

  componentDidMount() {
    setTimeout(
      () => this.props.doneCallback(),
      CHANGE_DELAY
    );
  }

  render() {
    return (
      <Slide>
        <div>
          You are a <span>Spy</span> along with:
        </div>
        <div>
          You are an <span>Agent</span>, be on the lookout for spies.
        </div>
      </Slide>
    );
  }
}

export { AssignRolesWidget };