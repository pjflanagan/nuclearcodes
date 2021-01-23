
// this has both text and toggle for create and join so we 
// can do error checking for people trying to join
// rooms that don't exist. Join is default

import React from 'react';

import { SlideComponent } from '../../slide_component';

import Style from './style.module.css';

class LobbyWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      done: false,
      createNewRoom: false,
      roomName: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.toggleCreateJoin = this.toggleCreateJoin.bind(this);
  }

  componentDidMount() {
    this.input.focus();
  }

  toggleCreateJoin(createNewRoom) {
    this.setState({
      createNewRoom: createNewRoom
    })
  }

  onChange(e) {
    this.setState({
      roomName: e.target.value,
    });
  }

  onKeyDown(e) {
    if (e.key === 'Enter') {
      this.onSubmit();
    }
  }

  onSubmit() {
    this.props.doneCallback();
    this.setState({ done: true });
  }

  render() {
    const { done, createNewRoom } = this.state;
    // TODO: auto tab into it when it shows up
    return (
      <SlideComponent done={done}>
        <div className={Style.toggle}>
          <div className={Style.optionsHolder}>
            <div
              className={`${Style.option} ${createNewRoom ? '' : Style.selected}`}
              onClick={() => this.toggleCreateJoin(false)}
            >
              Join Room
            </div>
            <div
              className={`${Style.option} ${createNewRoom ? Style.selected : ''}`}
              onClick={() => this.toggleCreateJoin(true)}
            >
              Create New Room
            </div>
          </div>
        </div>
        <input
          ref={(input) => { this.input = input; }}
          type="text"
          placeholder="Room Name"
          tabIndex={0}
          className={Style.input}
          onChange={e => this.onChange(e)}
          onKeyDown={e => this.onKeyDown(e)}
          disabled={done}
        />
      </SlideComponent>
    );
  }
}

export { LobbyWidget };