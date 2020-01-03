import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import Chess from 'chess.js';
import Chessboard from 'chessboardjsx';
import axios from 'axios';
import { Link } from 'react-router-dom';

let apiUrl = 'http://localhost:8000/api';

function Game(props) {
  let id = props.match.params.id;
  let newFen = '';
  let newHistory = [];
  let [chess, updateChess] = useState(new Chess());
  let [fen, updateFen] = useState('start');
  let [moveHistory, updateMoveHistory] = useState([]);
  let [playerOne, updatePlayerOne] = useState('');
  let [playerTwo, updatePlayerTwo] = useState('');
  //const [friends, setFriends] = useState([]);
  //const [seeks, setSeeks] = useState([]);
  let [squareStyles, updateSquareStyles] = useState({});
  let [pieceSquare, updatePieceSquare] = useState('');
  let [check, updateCheck] = useState(false);
  let [winner, updateWinner] = useState('');
  let [draw, updateDraw] = useState(false);
  let [drawReason, updateDrawReason] = useState('');

  //Play a random game
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

  // useEffect(() => {
    // axios.get(`http://localhost:8000/api/seeks/${localStorage.getItem('userId')}`)
    //   .then((response) => {
    //     console.log("Seek data: ", response.data);
    //     setSeeks(response.data);
    //   });
  // }, []);

  //Check if there are two players
  //If there is a move history, add it to the Chess game
  useEffect(() => {
    axios.get(`${apiUrl}/game/${id}`)
    .then(({ data, err }) => {
      if (err) {
        return console.log(err);
      }
      if (data.playerOne, data.friendId) {
        updatePlayerOne(data.playerOne);
        updatePlayerTwo(data.friendId);

        if(data.history.length > 0) {
          console.log('history exist');
          let history = data.history;
          let historyWithNumbers = [];
          console.log('history: ', history);
          let firstMove = `1.${history[0]}`;
          let moveString = '';

          //Create new game
          const game = new Chess();

          //Converting move history into a string to use in pgn
          let nr = 1;
          let newString = '';
          for(let i = 0; i < history.length; i++) {
            if(i % 2 === 0) {
              newString = `${nr}.${history[i]}`;
              historyWithNumbers.push(newString);
              nr++;
            }
            else {
              historyWithNumbers.push(history[i]);
            }
          }
          moveString = historyWithNumbers.join(' ');

          //Without 'white' and 'black' tags
          let pgn = [
            moveString,
          ];

          //With 'white' and 'black' tags
          // pgn = [
          //   `[White ${playerOne}]`,
          //   '[Black "Jean Dufresne"]',
          //   moveString,
          // ];

          //Load moves to Chess + update states chess and fen
          game.load_pgn(pgn.join('\n'));
          updateChess(game);
          updateFen(game.fen());
          updateMoveHistory(game.history());
          console.log('game: ', game);
        }
        else {
          console.log('no history');
        }
      }
    });
  }, []);

  //Check for fen updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      //console.log('Checking for new fen.');
      axios.get(`${apiUrl}/game/${id}`)
      .then((response) => {
        newFen = response.data.fen;

        //If fen has changed, update chess, fen and history
        if(newFen && newFen !== fen) {

          //Adding move to chess
          newHistory = response.data.history;
          let latestMove = newHistory[newHistory.length - 1];
          chess.move(latestMove);

          //Updating fen and history
          updateFen(newFen);
          updateMoveHistory(newHistory);

          checkForCheck();
          checkForGameOver();
        }
      });
    }, 1000);

    return () => {
      //console.log('clean');
      return clearTimeout(timer);
    };
  }, []);

  function onPieceClick(piece) {
    console.log(`${piece} was clicked.`);
    let allowed = chess.allowDrag();
    console.log('allowed? ' + allowed);
  }

  const squareStyling = ({ pieceSquare, history }) => {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
      [pieceSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
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
          pieceSquare: pieceSquare,
        }),
      }),
      {},
    );

    updateSquareStyles({ ...highlightStyles });
  };

  // keep clicked square style and remove hint squares
  function removeHighlightSquare() {
    //setState({ ...state, pieceSquare, history });
  };

  function checkForCheck() {
    if(chess.in_check()) {
      updateCheck(true);
    }
    else {
      updateCheck(false);
    }
  }

  function checkForGameOver() {
    if(chess.game_over()) {
      if(chess.in_checkmate()) {
        //The winner is the last player making a move
        let playerInTurn = chess.turn();
        if(playerInTurn === 'w') {
          updateWinner('black player');
        }
        else {
          updateWinner('white player');
        }
      }
      else if(chess.in_draw()) {
        updateDraw(true);
        //Check for draw reasons
        if(chess.in_stalemate()) {
          updateDrawReason('stalemate');
        }
        else if(chess.insufficient_material()) {
          updateDrawReason('insufficient material');
        }
      }
    }
  }

  function onMouseOverSquare(square) {
    if(winner || draw) {
      return;
    }

    // get list of possible moves for this square
    const moves = chess.moves({
      square,
      verbose: true,
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    const squaresToHighlight = [];
    for (let i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    //console.log('squaresToHighlight: ', squaresToHighlight);

    highlightSquare(square, squaresToHighlight);
  }

  function onMouseOutSquare(square) {
    removeHighlightSquare(square);
  }

  function onSquareClick(square) {
    console.log(`${square} was clicked`);
    //let piece = chess.get(square);
    //console.log(`piece: ${piece.type}`);

    //Update states
    updateSquareStyles(squareStyling({ pieceSquare: square, moveHistory }));
    updatePieceSquare(square);
  }

  function onDrop(sourceSquare) {
    let sourceSq = sourceSquare.sourceSquare;
    let targetSq = sourceSquare.targetSquare;
    let piece = sourceSquare.piece;
    let pieceType = piece.split('')[1];
    let isCapture = chess.get(targetSq);
    let sloppyMove = '';

    if(isCapture) {
      sloppyMove = pieceType + sourceSq + 'x' + targetSq;
    }
    else {
      sloppyMove = pieceType + sourceSq + targetSq;
    }

    let move = chess.move(sloppyMove, {sloppy: true});

    //If the move is acceptable, send it to the server
    if(move) {

      //Creating variables
      newFen = chess.fen();
      newHistory = chess.history();

      //Update fen and history
      updateFen(newFen);
      updateMoveHistory(newHistory);

      //Send move to backend
      axios.post(`${apiUrl}/game/move`, {
        id: id,
        gameFen: newFen, //State fen cannot be used since it may not be updated yet
        gameHistory: newHistory,
        gameStyle: "standard",
      })
      .then(function (response) {
        //console.log('POST response in onDrop');
        //console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

      //Check for check + game over
      checkForCheck();
      checkForGameOver();
    }
  }

  function onClickReset(e) {
    chess.reset();
    updateFen(chess.fen());

    //Send reset to backend
    axios.post(`${apiUrl}/game/move`, {
      id: id,
      gameFen: 'start',
      gameHistory: [],
      gameStyle: "standard",
    })
    .then(function (response) {
      //console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div className="App">
      <Helmet><title>Game</title></Helmet>
      <Link to='/lobby' className="btn btn-primary"><button type="submit">Back to Lobby</button></Link>
      <p><b>{playerOne}</b> against <b>{playerTwo}</b></p>
      { winner ? <h2>{winner} won!</h2> : null }
      { draw ? <h2>Remi!</h2> : null }
      { drawReason ? <h3>Game was drawn due to {drawReason}</h3> : null }
      { check && !winner && !draw ? <h2>Check!</h2> : null }
      <Chessboard
      position={fen}
      squareStyles={squareStyles}
      onMouseOverSquare={onMouseOverSquare}
      onMouseOutSquare={onMouseOutSquare}
      onSquareClick={onSquareClick}
      onDrop={onDrop}
      />
      <HistoryTable moveHistory={moveHistory}/>
      <button onClick={onClickReset}>Restart</button>
    </div>
  );
}

function HistoryTable(props) {
  let moves = props.moveHistory;
  let whitePlayer = true;

  let tableRows = [];
  let round = 1;
  let whiteMove = '';
  let blackMove = '';
  for(let i = 0; i < moves.length; i += 2) {
    whiteMove = moves[i];
    blackMove = moves[i+1];
    tableRows.push(
      <tr>
        <td>{round}</td>
        <td>{whiteMove}</td>
        <td>{blackMove}</td>
      </tr>
      );
    round++;
  }

  return(
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
