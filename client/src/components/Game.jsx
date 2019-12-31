import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import Chess from 'chess.js';
import Chessboard from 'chessboardjsx';
import axios from 'axios';
import { Link } from 'react-router-dom';

let apiUrl = 'http://localhost:8000/api';

function Game(props) {
  let [chess, updateChess] = useState(new Chess());
  let [fen, updateFen] = useState('start');
  let newFen = '';
  let [moveHistory, updateMoveHistory] = useState([]);
  let newHistory = [];
  let id = props.match.params.id;
  const [friends, setFriends] = useState([]);
  const [seeks, setSeeks] = useState([]);

  useEffect(() => {

    axios.get(`http://localhost:8000/api/game/${id}`)
    .then((response) => {
      // console.log("friends data: ",response.data);
      setFriends(response.data);
    });

    axios.get(`http://localhost:8000/api/seeks/${localStorage.getItem('userId')}`)
      .then((response) => {
        // console.log("Seek data: ", response.data);
        setSeeks(response.data);
      });
  }, []);

  //Check if there are two players
  //If there is a move history, add it to the Chess game
  useEffect(() => {
    axios.get(`${apiUrl}/game/${id}`)
    .then(({ data, err }) => {
      if (err) {
        return console.log(err);
      }
      console.log('Check for players and move history');

      if (data.playerOne, data.friendId) {
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

          let pgn = [
            moveString,
          ];

          //With 'white' and 'black' tags
          //let playerOne = data.playerOne;
          //let playerTwo = data.playerTwo;
          // pgn = [
          //   `[White "${playerOne}"]`,
          //   '[Black "Jean Dufresne"]',
          //   firstMove,
          // ];

          //Load moves to Chess + update states chess and fen
          game.load_pgn(pgn.join('\n'));
          updateChess(game);
          updateFen(game.fen());
          updateMoveHistory(game.history());
          //console.log(game);
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
        }
      });
    }, 1000);

    return () => {
      console.log('clean');
      return clearTimeout(timer);
    };
  });

  // do not pick up pieces if the game is over
  // only pick up pieces for the side to move
  // function onDragStart(source, piece, position, orientation) {
  //   if (chess.game_over() === true ||
  //       (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
  //       (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
  //     return false;
  //   }
  // };

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
    }
    else {
      console.log('ILLEGAL MOVE');
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
      <p><b>PlayerOne: {friends.playerOne}</b> against <b>friendId: {friends.friendId}</b></p>
      <Chessboard
      position={fen}
      onDrop={onDrop}
      />
      <HistoryTable moveHistory={moveHistory}/>
      <button onClick={onClickReset}>Restart</button>
    </div>
  );
}

function HistoryTable(props) {
  let moveHistory = props.moveHistory;
  let whitePlayer = true;

  let tableRows = moveHistory.map( move => {
    if(whitePlayer) {
      return <tr><td>{move}</td></tr>;
    }
    else {
      return <td>{move}</td>;
    }
    whitePlayer = !whitePlayer;
  });

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
