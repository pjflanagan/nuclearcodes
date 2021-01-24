import {
  ADD_PLAYER, CHANGE_SLIDE
} from './actionTypes';

export const addPlayer = (player) => ({
  type: ADD_PLAYER,
  player
});

export const changeSlide = (slide) => ({
  type: CHANGE_SLIDE,
  slide
})