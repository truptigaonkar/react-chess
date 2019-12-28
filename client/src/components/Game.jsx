import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import Chess from 'chess.js';
import Chessboard from 'chessboardjsx';
import axios from 'axios';
import { Link } from 'react-router-dom';
let chess = new Chess();

let apiUrl = 'http://localhost:3000';

function Game(props) {
  let [fen, updateFen] = useState('start');
  let [moveHistory, updateMoveHistory] = useState([]);
  let id = props.match.params.id;

  //NOT WORKING!
  useEffect(() => {
    axios.get(`${apiUrl}/game/${id}`).then((res) => {
      console.log(res);
      //If fen has changed, update fen and switch to this player
    });
  }, []);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     console.log('timer');
  //     //GET request
  //     axios.get(`${apiUrl}/game/333`)
  //     .then(function (response) {
  //       console.log(response);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  //   }, 1000);
  //
  //   return () => {
  //     console.log('clean');
  //     return clearTimeout(timer);
  //   };
  // },[]);

  function onDrop(sourceSquare) {
    let sourceSq = sourceSquare.sourceSquare;
    let targetSq = sourceSquare.targetSquare;
    let piece = sourceSquare.piece;
    let moveObject = {};
    let san = '';

    moveObject = chess.move({from: sourceSq, to: targetSq});

    //If the move is acceptable, send it to the server
    if(moveObject) {
      //Find out SAN string
      san = moveObject.san;

      // POST request
      axios.post(`${apiUrl}/game/${id}/${san}`
      //,{
        // playerTwo: 'Fred',
      //}
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      //Update chessboard and history
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
