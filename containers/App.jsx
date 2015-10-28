import React, {
  Component, PropTypes
}
  from 'react';
import {
  connect
}
  from 'react-redux';
import { bindActionCreators } from 'redux';
import * as boardActions from '../actions';
import Board from '../components/Board.jsx';
import _ from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleCellSelected = this.handleCellSelected.bind(this);
    this.startGame = this.startGame.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.findBoard = this.findBoard.bind(this);
  }

  handleCellSelected(pos) {
    this.props.actions.selectCell(pos);
  }

  startGame() {
    this.props.actions.startGame(500);
  }

  stopGame() {
    this.props.actions.stopGame(this.props.stopper);
  }

  findBoard(boardName) {
    this.props.actions.findBoard(boardName);
  }

  render() {
    return (
      <div>
        <Board onStart={this.startGame}
               onStop={this.stopGame}
               onFindBoard={this.findBoard}
               running={this.props.running}
               onCellClicked={this.handleCellSelected}
               board={this.props.board}/>
      </div>
    );
  }
}

App.propTypes = {
  board: PropTypes.object.isRequired,
  running: PropTypes.bool.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(boardActions, dispatch)
  };
}

function mapStateToProps(state) {
  const {
    selectedBoard, gameStatus
    } = state;

  return {
    board: selectedBoard.board,
    fetching: selectedBoard.fetching,
    running: gameStatus.running,
    stopper: gameStatus.stopper
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
