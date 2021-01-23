
import { SLIDES } from './slides';

const getNextSlide = (nextSlideID) => {
  console.log(nextSlideID);
  // TODO: this is going to be more complicated, since the number or rounds
  // varies we will have to do some kind of loop
  // next slide isn't just what the slide prompts
  return SLIDES.find(prompt => prompt.id === nextSlideID);
};

export { getNextSlide, SLIDES };