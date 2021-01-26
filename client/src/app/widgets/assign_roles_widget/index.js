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

  spyContent() {
    return (
      <div>
        You are a <span>Spy</span> along with:
      </div>
    );
  }

  agentContent() {
    return (
      <div>
        You are an <span>Agent</span>, be on the lookout for spies.
      </div>
    );
  }

  render() {
    const { me } = this.props;
    console.log({ me });
    const content = me.isSpy ? this.spyContent() : this.agentContent();
    return (
      <Slide>
        { content}
      </Slide>
    );
  }
}

export { AssignRolesWidget };