import React from 'react';
import Square from './Square';

const Board = ({ squares, onClick }) => {
  /**
   * マス目を表示する
   * @param {int} index
   * @returns {Function}
   */
  const renderSquare = (index) => {
    return (
      <Square squareValue={squares[index]} onClick={() => onClick(index)} />
    );
  };

  return (
    <>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </>
  );
};

export default Board;
