import React, {PropTypes, Component} from 'react';
import _ from 'lodash';
import Cell from "./Cell.jsx";

require('./Board.css');

export default class Board extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      text: this.props.boardName || ''
    };
  }

  renderRow(row, rowIndex) {
    return (
      <tr key={rowIndex}>
        {_.map(row, (selected, colIndex) =>
          (<Cell key={colIndex} pos={{row: rowIndex, col: colIndex}}
                selected={selected}
                onCellClicked={this.props.onCellClicked}/>))}
      </tr>
    );
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  findBoard() {
    this.props.onFindBoard(this.state.text);
  }

  render() {
    return (
      <div>
        <div className="board">
          <table>
            <tbody>
              {_.map(this.props.board, (r, i) => this.renderRow(r, i))}
           </tbody>
          </table>
        </div>
        <div className="actions">
          <button className="actions__button" onClick={this.props.onStart} disabled={this.props.running} >Start</button>
          <button className="actions__button" onClick={this.props.onStop} disabled={!this.props.running} >Stop</button>

          <div>
            <input type="text" onChange={this.handleChange.bind(this)} value={this.state.text} />
            <button className="actions__button" onClick={this.findBoard.bind(this)} disabled={this.props.running} >Find</button>
          </div>
        </div>
      </div>
    );
  }
}
