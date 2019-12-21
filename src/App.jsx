import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/Login';
import Lobby from './components/Lobby';

const App = () => (
  <div className="App">
    <Router basename={process.env.PUBLIC_URL}>
      <Route exact path="/" component={Login} />
      <Route path="/lobby" component={Lobby} />
    </Router>
  </div>
);

export default App;
