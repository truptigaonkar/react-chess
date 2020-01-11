import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import Chess from 'chess.js';
import Chessboard from 'chessboardjsx';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { URL } from './config';

function Game() {
  const { id } = useParams();
  let newFen = '';
  let newHistory = [];
  const [chess, updateChess] = useState(new Chess());
  const [fen, updateFen] = useState('start');
  const [moveHistory, updateMoveHistory] = useState([]);
  const [playerOne, updatePlayerOne] = useState('');
  const [playerTwo, updatePlayerTwo] = useState('');
  const [color, updateColor] = useState('');
  const [turn, updateTurn] = useState('');
  const [squareStyles, updateSquareStyles] = useState({});
  const [pieceSquare, updatePieceSquare] = useState('');
  const [check, updateCheck] = useState(false);
  const [winner, updateWinner] = useState('');
  const [draw, updateDraw] = useState(false);
  const [drawReason, updateDrawReason] = useState('');

  function checkForCheck() {
    if (chess.in_check()) {
      updateCheck(true);
    } else {
      updateCheck(false);
    }
  }

  function checkForGameOver() {
    if (chess.game_over()) {
      if (chess.in_checkmate()) {
        // The winner is the last player making a move
        const playerInTurn = chess.turn();
        if (playerInTurn === 'w') {
          updateWinner('black player');
        } else {
          updateWinner('white player');
        }
      } else if (chess.in_draw()) {
        updateDraw(true);
        // Check for draw reasons
        if (chess.in_stalemate()) {
          updateDrawReason('stalemate');
        } else if (chess.insufficient_material()) {
          updateDrawReason('insufficient material');
        }
      }
    }
  }

  // Play a random game
  // useEffect(() => {
  //   while (!chess.game_over()) {
  //     var moves = chess.moves();
  //     var move = moves[Math.floor(Math.random() * moves.length)];
  //     chess.move(move);
  //     //Update fen and history
  //     updateFen(chess.fen());
  //     updateMoveHistory(chess.history());
  //     //Check for game over
  //     checkForCheck();
  //     checkForGameOver();
  //   }
  // }, []);

  // Check if there are two players
  // If there is a move history, add it to the Chess game
  useEffect(() => {
    // Fetch user id from local storage
    const myUserId = window.localStorage.getItem('userId');
    console.log('myUserId: ', myUserId);

    // GET request
    axios.get(`${URL}/api/game/${id}`)
      .then(({ data, err }) => {
        if (err) {
          return console.log(err);
        }

        console.log('Answer from /game/id: ', data);

        // Start game if not started
        // Player two starts the game when entering game page
        // *Checking if there is a playerOne that is not me*
        if(!data.started && data.playerOne && myUserId !== data.playerOne) {
          axios.post(`${URL}/api/game/play`, {
            playerTwo: myUserId,
             id
          })
          .then(function (response) {
            console.log('response from /game/play: ', response);
          })
          .catch(function (error) {
            console.log(error);
          });
        }

        // Set color
        if(data.w) {
          if(data.w === myUserId) {
            console.log('My color is white');
            updateColor('white');
          }
          else {
            console.log('My color is black');
            updateColor('black');
          }
        }
        else if(data.b) {
          if(data.b === myUserId) {
            console.log('My color is black');
            updateColor('black');
          }
          else {
            console.log('My color is white');
            updateColor('white');
          }
        }

        // Load move history
        if (data.history.length > 0) {
          console.log('history exist');
          const { history } = data;
          const historyWithNumbers = [];
          console.log('history: ', history);
          let moveString = '';

          // Create new game
          const game = new Chess();

          // Converting move history into a string to use in pgn
          let nr = 1;
          let newString = '';
          for (let i = 0; i < history.length; i += 1) {
            if (i % 2 === 0) {
              newString = `${nr}.${history[i]}`;
              historyWithNumbers.push(newString);
              nr += 1;
            } else {
              historyWithNumbers.push(history[i]);
            }
          }
          moveString = historyWithNumbers.join(' ');

          //Creating pgn
          const pgn = [
            moveString,
          ];

          // Load moves to game
          // Then update chess, fen and moveHistory
          game.load_pgn(pgn.join('\n'));
          updateChess(game);
          updateFen(game.fen());
          updateMoveHistory(game.history());
          // updateTurn(game.turn());
          console.log('game: ', game);
        } else {
          console.log('no history');
          // updateTurn('white');
        }
      });
  }, [id]);

  // Check for fen updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Checking for new fen.');
      axios.get(`${URL}/api/game/${id}`)
        .then((response) => {
          newFen = response.data.fen;
          // If fen has changed, update chess, fen and history
          if (newFen && newFen !== fen) {
            console.log('Detected a new fen.');
            // Adding move to chess
            newHistory = response.data.history;
            const latestMove = newHistory[newHistory.length - 1];
            console.log('latest move: ', latestMove);
            chess.move(latestMove);

            // Updating fen and history
            updateFen(newFen);
            updateMoveHistory(newHistory);

            checkForCheck();
            checkForGameOver();
          }
        });
    }, 1000);

    return () => {
      // console.log('clean');
      clearTimeout(timer);
    };
  }, []);

  const squareStyling = ({ pieceSqr, history }) => {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
      [pieceSqr]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
      ...(history.length && {
        [sourceSquare]: {
          backgroundColor: 'rgba(255, 255, 0, 0.4)',
        },
      }),
      ...(history.length && {
        [targetSquare]: {
          backgroundColor: 'rgba(255, 255, 0, 0.4)',
        },
      }),
    };
  };

  // Show possible moves
  const highlightSquare = (sourceSquare, squaresToHighlight) => {
    // console.log('highlightSquare');
    // console.log('moveHistory: ', moveHistory);
    // console.log('pieceSquare: ', pieceSquare);
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => ({
        ...a,
        ...{
          [c]: {
            background:
                'radial-gradient(circle, #fffc00 36%, transparent 40%)',
            borderRadius: '50%',
          },
        },
        ...squareStyling({
          history: moveHistory,
          pieceSquare,
        }),
      }),
      {},
    );

    updateSquareStyles({ ...highlightStyles });
  };

  // keep clicked square style and remove hint squares
  function removeHighlightSquare() {
    // setState({ ...state, pieceSquare, history });
  }

  function allowDrag(data) {
    const { piece } = data;
    const pieceColor = piece.charAt(0);
    // Stop a player from moving the opponents pieces
    if (color === 'white' && pieceColor === 'b') {
      return false;
    }
    if (color === 'black' && pieceColor === 'w') {
      return false;
    }
    // Stop all moves when the game is over
    if (winner || draw) {
      return false;
    }
    return true;
  }

  function onMouseOverSquare(square) {
    // Do nothing if the game is over, or if it's the other player's piece
    if (winner || draw) return;
    const piece = chess.get(square);
    if (piece) {
      const pieceColor = piece.color;
      if (color === 'white' && pieceColor === 'b') return;
      if (color === 'black' && pieceColor === 'w') return;
    }

    // Get list of possible moves for this square
    const moves = chess.moves({
      square,
      verbose: true,
    });

    // Exit if there are no moves available for this square
    if (moves.length === 0) return;

    const squaresToHighlight = [];
    for (let i = 0; i < moves.length; i += 1) {
      squaresToHighlight.push(moves[i].to);
    }

    highlightSquare(square, squaresToHighlight);
  }

  function onMouseOutSquare(square) {
    removeHighlightSquare(square);
  }

  function onSquareClick(square) {
    console.log(`${square} was clicked`);
    // let piece = chess.get(square);
    // console.log(`piece: ${piece.type}`);
    console.log('moveHistory: ', moveHistory);

    // Update states
    updateSquareStyles(squareStyling({ pieceSquare: square, history: moveHistory }));
    updatePieceSquare(square);
  }

  function onDrop(sourceSquare) {
    console.log('onDrop');
    const sourceSq = sourceSquare.sourceSquare;
    const targetSq = sourceSquare.targetSquare;
    const { piece } = sourceSquare;
    const pieceType = piece.split('')[1];
    const isCapture = chess.get(targetSq);
    let sloppyMove = '';

    if (isCapture) {
      sloppyMove = `${pieceType + sourceSq}x${targetSq}`;
    } else {
      sloppyMove = pieceType + sourceSq + targetSq;
    }

    const move = chess.move(sloppyMove, { sloppy: true });
    console.log('sloppyMove: ', sloppyMove);
    console.log('chess: ', chess);
    console.log('chess.moves: ', chess.moves());
    console.log('chess.turn: ', chess.turn());
    console.log('move: ', move);

    // If the move is acceptable, send it to the server
    if (move) {
      // Creating variables
      newFen = chess.fen();
      newHistory = chess.history();

      // Update fen and history
      updateFen(newFen);
      updateMoveHistory(newHistory);

      // Send move to backend
      axios.post(`${URL}/api/game/move`, {
        id,
        gameFen: newFen, // State fen cannot be used since it may not be updated yet
        gameHistory: newHistory,
        gameStyle: 'standard',
      })
        .then((response) => {
        // console.log('POST response in onDrop');
        // console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

      // Check for check + game over
      checkForCheck();
      checkForGameOver();
    }
  }

  function onClickReset() {
    chess.reset();
    updateFen(chess.fen());
    updateMoveHistory(chess.history());

    // Send reset to backend
    axios.post(`${URL}/api/game/move`, {
      id,
      gameFen: 'start',
      gameHistory: [],
      gameStyle: 'standard',
    })
      .then((response) => {
      // console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // console.log('moveHistory before return: ', moveHistory);

  return (
    <div className="App">
      <Helmet><title>Game</title></Helmet>
      <Link to="/lobby" className="btn btn-primary"><button type="submit">Back to Lobby</button></Link>
      {/* <p><b>{playerOne}</b>{' '}against{' '}<b>{playerTwo}</b></p> */}
      <h2>Player in turn: {chess.turn() === 'w' ? 'white' : 'black'}</h2>
      { winner ? (
        <h2>
          {winner}
          {' '}
won!
        </h2>
      ) : null }
      { draw ? <h2>Remi!</h2> : null }
      { drawReason ? (
        <h3>
        Game was drawn due to
          {drawReason}
        </h3>
      ) : null }
      { check && !winner && !draw ? <h2>Check!</h2> : null }
      <Chessboard
        position={fen}
        squareStyles={squareStyles}
        onMouseOverSquare={onMouseOverSquare}
        onMouseOutSquare={onMouseOutSquare}
        onSquareClick={onSquareClick}
        onDrop={onDrop}
        allowDrag={allowDrag}
      />
      <HistoryTable moveHistory={moveHistory} />
      <button type="button" onClick={onClickReset}>Restart</button>
    </div>
  );
}

function HistoryTable({ moveHistory: moves }) {
  const tableRows = [];
  let round = 1;
  let whiteMove = '';
  let blackMove = '';
  for (let i = 0; i < moves.length; i += 2) {
    whiteMove = moves[i];
    blackMove = moves[i + 1];
    tableRows.push(
      <tr key={round}>
        <td>{round}</td>
        <td>{whiteMove}</td>
        <td>{blackMove}</td>
      </tr>,
    );
    round += 1;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Moves</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </table>
  );
}

export default Game;
