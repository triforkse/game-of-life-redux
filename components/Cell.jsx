import React, {
  PropTypes, Component
}
  from 'react';

require('./Cell.css');

export default class Cell extends Component {

  render() {
    const className = this.props.selected ? "board__cell--selected" : "";
    return (
      <td className={className + " board__cell"} onClick={this.props.onCellClicked.bind(this, this.props.pos)}></td>
    );
  }
}
