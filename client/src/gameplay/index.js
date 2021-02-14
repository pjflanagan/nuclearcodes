
import { GAMEPLAY } from './gameplay';

const getNextSlide = (nextSlideID, applyData = {}) => {
  const gameplaySlide = GAMEPLAY.find(slide => slide.id === nextSlideID);

  // make a copy so data points to new object
  const slide = Object.assign({}, gameplaySlide);

  if (!slide) {
    console.error(`Cannot find slideID '${nextSlideID}' in GAMEPLAY`);
    return GAMEPLAY.find(slide => slide.id === 'error')
  }

  if (!!slide.data) {
    Object.assign(slide.data, applyData);
  } else {
    slide.data = applyData;
  }

  return slide;
};

export { GAMEPLAY, getNextSlide };