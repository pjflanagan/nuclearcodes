import React from 'react'

import Style from './style.module.css'

class Scroller extends React.Component {
  constructor(props) {
    super(props);

    this.scrollBottom = this.scrollBottom.bind(this);
  }

  componentDidMount() {
    this.scrollBottom();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.slideCount !== this.props.slideCount) {
      setTimeout(this.scrollBottom, 100); // delay just a little bit so the element can render
    }
  }

  scrollBottom() {
    this.bottomRef.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    return (
      <div
        className={Style.scroller}
        ref={elem => { this.bottomRef = elem; }}
      />
    );
  }
}

const ScrollPadding = () => (
  <div className={Style.scrollPadding} />
);

export { Scroller, ScrollPadding }