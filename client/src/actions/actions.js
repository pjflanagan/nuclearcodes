import {
  ADD_PLAYER, NEXT_SLIDE
} from './actionTypes';

export const addPlayer = (player) => ({
  type: ADD_PLAYER,
  player
});

export const nextSlide = (slide) => ({
  type: NEXT_SLIDE,
  slide
})