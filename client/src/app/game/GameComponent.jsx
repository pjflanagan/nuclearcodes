import React from 'react'
import PropTypes from 'prop-types'

import Style from './style.module.css';


const GameComponent = ({ slides, changeSlide }) => (
  < div className={Style.gameContainer} >
    <div className={Style.slidesHolder}>
      {
        slides.map((slide, i) => (
          <slide.widget
            key={i}
            data={slide.data}
            prevData={slide.prevData}
            doneCallback={(prevData) => changeSlide(slide.next, prevData)}
          />
        ))
      }
    </div>
  </div >
)

GameComponent.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    widget: PropTypes.oneOfType([
      PropTypes.instanceOf(React.Component),
      PropTypes.func
    ]).isRequired
  }).isRequired).isRequired,
  changeSlide: PropTypes.func.isRequired
}

export { GameComponent };
