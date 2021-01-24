import {
  ADD_PLAYER, NEXT_SLIDE, JOIN_ROOM
} from './actionTypes';

export const addPlayer = (player) => ({
  type: ADD_PLAYER,
  player
});

export const nextSlide = (slide) => ({
  type: NEXT_SLIDE,
  slide
})

export const joinRoom = (room) => ({
  type: JOIN_ROOM,
  room
})