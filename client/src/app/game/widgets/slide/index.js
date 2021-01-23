import React from 'react';

class Slide extends React.Component {
  render() {
    const { done, children } = this.props;
    return (
      <div>
        { children}
      </div>
    )
  }
}

export { Slide };