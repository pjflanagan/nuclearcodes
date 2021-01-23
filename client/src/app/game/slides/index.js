
import { SLIDES } from './slides';

const getNextSlide = (id) => {
  return PROMPTS.find(prompt => prompt.id === id);
};

export { getNextSlide, SLIDES };