import React, { useEffect, useState } from 'react';
import Chess from 'chess.js';
import Chessboard from 'chessboardjsx';
import './App.css';
let chess = new Chess();
let pgn = chess.pgn();

function App() {
  let [fen, updateFen] = useState('start');
  let [moveHistory, updateMoveHistory] = useState([]);
  let newFen = '';

  function updateView() {
    newFen = chess.fen();
    updateFen(newFen);
  }

  function onDrop(sourceSquare) {
    let sourceSq = sourceSquare.sourceSquare;
    let targetSq = sourceSquare.targetSquare;
    let piece = sourceSquare.piece;
    let moveObject = {};
    let newFen = '';

    // console.log(sourceSq, targetSq, piece);

    moveObject = chess.move({from: sourceSq, to: targetSq});

    // console.log(moveObject);

    if(moveObject) {
      console.log('Legal move.');
      updateView();
      let updatedHistory = chess.history();
      updateMoveHistory(updatedHistory);
    }
    else {
      console.log('ILLEGAL MOVE');
    }
  }

  function onClickReset(e) {
    chess.reset();
    updateView();
  }

  return (
    <div className="App">
      <Chessboard
      position={fen}
      onDrop={onDrop}
      />
      <MovesTable moveHistory={moveHistory}/>
      <button onClick={onClickReset}>Restart</button>
    </div>
  );
}

function MovesTable(props) {
  let moveHistory = props.moveHistory;
  console.log(moveHistory);

  let tableRows = moveHistory.map( move => {
    return <tr><td>{move}</td></tr>;
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

export default App;
