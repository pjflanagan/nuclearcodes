import React from 'react';

import { SlideComponent } from '../../slide_component';

import Style from './style.module.css';

class RoomWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      done: false,
      roomName: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.input.focus();
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
    const { done } = this.state;
    // TODO: auto tab into it when it shows up
    return (
      <SlideComponent done={done}>
        <input
          ref={(input) => { this.input = input; }}
          type="text"
          placeholder="Your Secret Agent Name"
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

export { RoomWidget };