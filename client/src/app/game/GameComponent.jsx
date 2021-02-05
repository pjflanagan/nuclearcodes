import React from 'react'
import PropTypes from 'prop-types';

import { ErrorWidget } from '../widgets';

import Style from './style.module.css';

const GameComponent = ({ slides, gameState, dispatchDoneCallback, socketService, errors, setErrors }) => {
  const socketID = socketService.getID();
  return (
    <div className={Style.gameContainer}>
      <div className={Style.slidesHolder}>
        {
          slides.map((slide, i) => (
            <slide.widget
              key={i}
              gameState={gameState}
              data={slide.data}
              socketID={socketID}
              doneCallback={(prevData) => dispatchDoneCallback({
                next: slide.next,
                delay: slide.delay,
                prevData
              })}
              socketService={socketService}
              isCurrent={i === slides.length - 1}
              setErrors={setErrors}
            />
          ))
        }
        <ErrorWidget errors={errors} />
      </div>
    </div >
  );
}

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
