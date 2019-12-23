/* eslint-disable no-undef */
import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

const Game = () => {
  return (
    <>
      <Helmet><title>Game</title></Helmet>
      <Link to='/lobby' className="btn btn-primary"><button type="submit">Back to Lobby</button></Link>
      <h3>Game Component</h3>
    </>
  );
};

export default Game;