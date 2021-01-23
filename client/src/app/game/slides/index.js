
import { SLIDES } from './slides';

const getNextSlide = (nextSlideID) => {
  return SLIDES.find(prompt => prompt.id === nextSlideID);
};

export { getNextSlide, SLIDES };