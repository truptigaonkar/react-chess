import React, { useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';


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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit
          <code>src/App.js</code>
and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};


export default App;
