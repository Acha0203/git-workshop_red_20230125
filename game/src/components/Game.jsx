import React, { useCallback, useEffect, useState } from 'react';
import Board from './Board';

const Game = () => {
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
    },
  ]);
  const [xIsNext, setXIsNext] = useState(true);
  const [moves, setMoves] = useState(true);
  const [disabledClick, setDisabledClick] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [playersTurn, setPlayersTurn] = useState(true);
  const [currentSquares, setCurrentSquares] = useState([]);
  const current = history[playCount];

  const MAX_PLAY_COUNT = 9;

  useEffect(() => {
    const moves = history.map((step, move) => {
      const desc = move ? `Go to move # ${move}` : `Go to game start`;
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}> {desc} </button>
        </li>
      );
    });
    setMoves(moves);
  }, [history]);

  /**
   * マス目クリック時
   * @param {int} index
   */
  const handleClick = (index) => {
    setDisabledClick(true);

    const historyCurrentOrigin = history.slice(0, playCount + 1);
    let historyCurrent = JSON.parse(JSON.stringify(historyCurrentOrigin));
    const current = historyCurrent[historyCurrent.length - 1];
    const squaresOrigin = current.squares.slice();
    const squares = JSON.parse(JSON.stringify(squaresOrigin));

    if (calculateWinner(squares) || squares[index]) {
      return;
    }
    squares[index] = xIsNext ? 'X' : 'O';
    setPlayCount((prevValue) => prevValue + 1);
    setHistory([...historyCurrent, { squares }]);
    setPlayersTurn(false);
    setCurrentSquares(squares);
  };

  /**
   * タイムトラベル
   */
  const jumpTo = (step) => {
    setPlayCount(step);
    setXIsNext(step % 2 === 0);
  };

  const cpuAction = useCallback(() => {
    let squares = JSON.parse(JSON.stringify(currentSquares));

    if (calculateWinner(squares)) return;
    const currentHistoryOrigin = history.slice(0, playCount + 2);
    let currentHistory = JSON.parse(JSON.stringify(currentHistoryOrigin));
    const possible_hands = [];
    let hand = squares.indexOf(null);
    while (hand !== -1) {
      possible_hands.push(hand);
      hand = squares.indexOf(null, hand + 1);
    }

    if (possible_hands.length === 0) return;

    const action_hand =
      possible_hands[Math.floor(Math.random() * possible_hands.length)];
    const cpuStatus = !xIsNext;
    squares[action_hand] = cpuStatus ? 'X' : 'O';
    // currentHistory[history.length - 1].squares = squares;

    setHistory([...currentHistory, { squares }]);
    setPlayCount((prevValue) => prevValue + 1);
    setXIsNext(xIsNext);
    setPlayersTurn(true);
  }, [currentSquares, history, playCount, xIsNext]);

  useEffect(() => {
    console.log(history);
    console.log(playCount);

    if (!playersTurn) {
      setTimeout(() => {
        cpuAction();
        setDisabledClick(false);
      }, 1000);
    }
  }, [cpuAction, history, playCount, playersTurn]);

  /**
   * 勝者/次のプレイヤーを表示
   * @returns {string}
   */
  const getWinner = () => {
    const winner = calculateWinner(history[playCount].squares);
    if (winner) {
      return '勝者: ' + winner;
    } else if (playCount === MAX_PLAY_COUNT) {
      return '引き分けです';
    } else {
      return '次のプレイヤー: ' + (xIsNext ? 'あなた' : 'CPU');
    }
  };

  /**
   * 勝敗を計算する
   * @param {array} resultSquares
   * @returns {string|null}
   */
  const calculateWinner = (resultSquares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        resultSquares[a] &&
        resultSquares[a] === resultSquares[b] &&
        resultSquares[a] === resultSquares[c]
      ) {
        return resultSquares[a];
      }
    }
    return null;
  };

  // 全てを初期化する
  //const resetAll = () => {
  //  setHistory(
  //      {
  //          squares: Array(9).fill(null)
  //      }
  //  );
  //  setXIsNext(true);
  //};

  return (
    <div className={'game ' + (disabledClick ? 'disabled' : '')}>
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(index) => handleClick(index)}
        />
      </div>
      <div className="game-info">
        <div>{getWinner()}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default Game;
