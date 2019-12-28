import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import Chess from 'chess.js';
import Chessboard from 'chessboardjsx';
import axios from 'axios';
import { Link } from 'react-router-dom';
let chess = new Chess();

let apiUrl = 'http://localhost:8000/api';

function Game(props) {
  let [fen, updateFen] = useState('start');
  let newFen = '';
  let [moveHistory, updateMoveHistory] = useState([]);
  let id = props.match.params.id;

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Checking for new fen.');
      axios.get(`${apiUrl}/game/${id}`).then((response) => {
        console.log(response);
        newFen = response.data.fen;
        if(newFen === fen) {
          console.log('fen is unchanged.');
        }
        //If fen has changed, update fen
        if(newFen !== fen) {
          console.log('Updating fen.');
          updateFen(newFen);
        }
      });
    }, 1000);

    return () => {
      console.log('clean');
      return clearTimeout(timer);
    };
  });

  useEffect(() => {
    // POST request
    axios.post(`${apiUrl}/game/move`, {
      id: id,
      gameFen: fen,
      gameHistory: moveHistory,
      gameStyle: "standard",
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }, [moveHistory]);

  function onDrop(sourceSquare) {
    let sourceSq = sourceSquare.sourceSquare;
    let targetSq = sourceSquare.targetSquare;
    let piece = sourceSquare.piece;
    let moveObject = {};

    moveObject = chess.move({from: sourceSq, to: targetSq});

    //If the move is acceptable, send it to the server
    if(moveObject) {
      //Update fen and history
      updateFen(chess.fen());
      updateMoveHistory(chess.history());
    }
    else {
      console.log('ILLEGAL MOVE');
      //Is there a piece in the target square?
    }
  }

  function onClickReset(e) {
    chess.reset();
    updateFen(chess.fen());
  }

  return (
    <div className="App">
      <Helmet><title>Game</title></Helmet>
      <Link to='/lobby' className="btn btn-primary"><button type="submit">Back to Lobby</button></Link>
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
  console.log(moveHistory);

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
