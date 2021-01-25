import React from 'react'
import PropTypes from 'prop-types'

import Style from './style.module.css';


const GameComponent = ({ slides, gameState, dispatchDoneCallback, socketService }) => (
  <div className={Style.gameContainer}>
    <div className={Style.slidesHolder}>
      {
        slides.map((slide, i) => (
          <slide.widget
            key={i}
            gameState={gameState}
            data={slide.data}
            doneCallback={(prevData) => dispatchDoneCallback(slide.next, prevData)}
            socketService={socketService}
            isCurrent={i === slides.length - 1}
          />
        ))
      }
    </div>
  </div >
)

GameComponent.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    // widget: PropTypes.oneOfType([
    //   PropTypes.instanceOf(React.Component),
    //   PropTypes.func
    // ]).isRequired
  }).isRequired).isRequired,
  dispatchDoneCallback: PropTypes.func.isRequired
}

export { GameComponent };
