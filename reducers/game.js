import {
  CELL_SELECTED, NEXT_GENERATION,
  GAME_STARTED, STOP_GAME, GAME_STOPPED,
  REQUEST_BOARD, RECEIVE_BOARD
}
from '../actions';
import _ from 'lodash';

export function generateDefualtBoard(size) {
  const range = _.range(size);
  const columns = _.zipObject(range, _.times(size, () => false));
  return _.zipObject(range, _.times(size, () => _.clone(columns)));
}

function neighborCount(ac, cell) {
  const row = parseInt(cell.row);
  const col = parseInt(cell.col);
  return _.filter([
    _.get(ac, [row - 1, col]),
    _.get(ac, [row - 1, col - 1]),
    _.get(ac, [row - 1, col + 1]),
    _.get(ac, [row, col - 1]),
    _.get(ac, [row, col + 1]),
    _.get(ac, [row + 1, col]),
    _.get(ac, [row + 1, col - 1]),
    _.get(ac, [row + 1, col + 1])
  ]).length;
}

function aliveInRow(row, columns, board) {
  return _.reduce(columns, (acc, alive, col) => {
    const nc = neighborCount(board, {
      row, col
    });
    if (nc === 3) {
      return Object.assign({}, acc, {
        [col]: true
      });
    } else if (nc > 3) {
      return Object.assign({}, acc, {
        [col]: false
      });
    } else if (nc < 2) {
      return Object.assign({}, acc, {
        [col]: false
      });
    }
    return Object.assign({}, acc, {
      [col]: alive
    });
  }, {
    [row]: columns
  });
}

function nextGeneration(state) {
  return _.reduce(state, (acc, columns, row) => {
    return Object.assign({}, acc, {
      [row]: aliveInRow(row, columns, state)
    })
  }, Object.assign({}, state));
}

function getSize(selectedCells) {
  const xValues = _.map(_.keys(selectedCells), x => parseInt(x));
  const yValues = _.map(_.flatten(_.values(selectedCells)), y => parseInt(y));
  const xMax = Math.max.apply(null, xValues);
  const yMax = Math.max.apply(null, yValues);
  const xMin = Math.min.apply(null, xValues);
  const yMin = Math.min.apply(null, yValues);
  const width = xMax - xMin;
  const height = yMax - yMin;
  return {yMin, xMin, width, height};
}

function getShift(xMin, yMin) {
  const min = Math.min(xMin, yMin);
  return min * -1;
}

function parseBoard(board, selectedCells) {
  const {yMin, xMin, width, height} = getSize(selectedCells);
  const shift = getShift(xMin, yMin);
  const size = Math.max(width, height) + 5;
  const blankBoard = generateDefualtBoard(size);

  const nextBoard = _.reduce(selectedCells, (acc, columns, row) => {
    const shiftedRow = parseInt(row)+shift;
    return Object.assign({}, acc, {
      [shiftedRow]: Object.assign({}, acc[shiftedRow], _(columns).map(c => parseInt(c) + shift)
                             .zipObject(_.times(columns.length, () => true))
                             .value())
    })
  }, blankBoard)

  return nextBoard;
}

export function selectedBoard(state = {
  board: generateDefualtBoard(25),
  fetching: false,
  boardName: ''
}, action) {
  switch (action.type) {
    case CELL_SELECTED:
      return Object.assign({}, state, {
        board: Object.assign({}, state.board, {
          [action.pos.row]: Object.assign({},
            state.board[action.pos.row], {
              [action.pos.col]: true
            })
        })
      });
    case NEXT_GENERATION:
      return Object.assign({}, state, {
        board: nextGeneration(state.board)
      });
    case REQUEST_BOARD:
      return Object.assign({}, state, {
        fetching: true,
        boardName: action.boardName
      });
    case RECEIVE_BOARD:
      return Object.assign({}, state, {
        fetching: false,
        board: parseBoard(state.board, action.board)
      })
    default:
      return state;
  }
}

export function gameStatus(state = {
  running: false
}, action) {
  switch (action.type) {
    case GAME_STARTED:
      return Object.assign({}, state, {
        running: true,
        stopper: action.stopper
      });
    case GAME_STOPPED:
      return Object.assign({}, state, {
        running: false
      })
    default:
      return state;
  }
}
