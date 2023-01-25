import React from 'react';

const Square = ({ squareValue, onClick }) => {
  return (
    <button className="square" onClick={() => onClick()}>
      {squareValue}
    </button>
  );
};

export default Square;
