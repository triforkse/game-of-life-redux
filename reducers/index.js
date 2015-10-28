import {combineReducers} from 'redux';
import {selectedBoard, gameStatus} from './game'

const rootReducer = combineReducers({
  selectedBoard,
  gameStatus
});

export default rootReducer;
