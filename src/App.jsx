import React, { useState, useEffect } from 'react';
import Chess from 'chess.js';
import logo from './logo.svg';
import './App.css';
let chess = new Chess;
let pgn = chess.pgn();

function App() {

  useEffect( () => {
    console.log('chess: ', chess);
    console.log('pgn: ', pgn);
  });

  return (
    <div className="App">
    </div>
  );
}

export default App;
