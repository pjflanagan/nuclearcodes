import {
  ADD_PLAYER, NEXT_SLIDE, JOIN_ROOM, UPDATE_GAME_STATE, SET_PLAYER_NAME
} from './actionTypes';

// TODO: am I using this one?
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

export const setPlayerName = (playerName) => ({
  type: SET_PLAYER_NAME,
  playerName
})

export const updateGameState = (gameState) => ({
  type: UPDATE_GAME_STATE,
  gameState
})