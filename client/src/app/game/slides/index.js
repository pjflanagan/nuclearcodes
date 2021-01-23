
import { SLIDES } from './slides';

const getNextSlide = (nextSlideID, prevData) => {
  const slide = SLIDES.find(prompt => prompt.id === nextSlideID);
  slide.prevData = prevData;
  return slide;
};

export { getNextSlide, SLIDES };