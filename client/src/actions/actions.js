import {
  NEXT_SLIDE, JOIN_ROOM, UPDATE_GAME_STATE, SET_PLAYER_NAME, SET_ERRORS
} from './actionTypes';

export const nextSlide = (slide) => ({
  type: NEXT_SLIDE,
  slide
})

export const joinRoom = (room) => ({
  type: JOIN_ROOM,
  room
})

export const setPlayerName = (playerName) => ({
  type: SET_PLAYER_NAME,
  playerName
})

export const updateGameState = (gameState) => ({
  type: UPDATE_GAME_STATE,
  gameState
})

export const setErrors = (errors) => ({
  type: SET_ERRORS,
  errors
})
