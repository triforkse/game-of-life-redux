import fetch from 'isomorphic-fetch';

export const CELL_SELECTED = 'CELL_SELECTED';
export const NEXT_GENERATION = 'NEXT_GENERATION';
export const START_GAME = 'START_GAME';
export const GAME_STARTED = 'GAME_STARTED';
export const STOP_GAME = 'STOP_GAME';
export const GAME_STOPPED = 'GAME_STOPPED';
export const REQUEST_BOARD = 'REQUEST_BOARD';
export const RECEIVE_BOARD = 'RECEIVE_BOARD';

export function selectCell(pos) {
  return {
    type: CELL_SELECTED,
    pos
  }
}

export function requestBoard(boardName) {
  return {
    type: REQUEST_BOARD
  }
}

export function receiveBoard(boardName, board) {
  return {
    type: RECEIVE_BOARD,
    boardName,
    board
  }
}

export function findBoard(boardName) {
  return dispatch => {
    dispatch(requestBoard(boardName));
    return fetch(`/board/${boardName}`)
      .then(response => response.json())
      .then(json => dispatch(receiveBoard(boardName, json)));
  };
}

export function nextGeneration() {
  return {
    type: NEXT_GENERATION
  }
}

export function startGame(interval) {
  return dispatch => {
    const id = setInterval(() => dispatch(nextGeneration()), interval);

    dispatch(gameStarted(() => clearInterval(id)));
  }
}

export function gameStarted(stopper) {
  return {
    type: GAME_STARTED,
    stopper
  }
}

export function stopGame(stopper) {
  return function(dispatch) {
    stopper();

    dispatch(gameStopped());
  }
}

export function gameStopped() {
  return {
    type: GAME_STOPPED
  }
}
