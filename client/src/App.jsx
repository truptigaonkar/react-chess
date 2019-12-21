import React, { useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Lobby from './components/Lobby';

const App = () => {
  useEffect(() => {
    axios.get('http://localhost:8000/api/seeks').then((res) => {
      console.log(res);
    });
  }, []);
  useEffect(() => {
    axios.post('http://localhost:8000/api/seeks/').then((res) => {
      console.log(res);
    });
  }, []);
  useEffect(() => {
    axios.post('http://localhost:8000/api/seeks/333').then((res) => {
      console.log(res);
    });
  }, []);
  useEffect(() => {
    axios.get('http://localhost:8000/api/game/333').then((res) => {
      console.log(res);
    });
  }, []);
  useEffect(() => {
    axios.post('http://localhost:8000/api/game/333/2_3').then((res) => {
      console.log(res);
    });
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Let's play chess!
        </h1>
      </header>
      <Lobby />
    </div>
  );
};


export default App;
