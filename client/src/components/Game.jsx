import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import Chessboard from 'chessboardjsx';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { URL } from "../components/config";

function Game(props) {
  let [fen] = useState('start');
  let { id } = useParams();
  const [friends, setFriends] = useState([]);
  const [seeks, setSeeks] = useState([]);

  useEffect(() => {
    axios.get(`${URL}/api/game/${id}`)
    .then((response) => {
      setFriends(response.data);
    });
    axios.get(`${URL}/api/seeks/${localStorage.getItem('userId')}`)
      .then((response) => {
        setSeeks(response.data);
      });
  }, [id]);

  return (
    <div className="App">
      <Helmet><title>Game</title></Helmet>
      <Link to='/lobby' className="btn btn-primary"><button type="submit">Back to Lobby</button></Link>
      <p><b>PlayerOne: {friends.playerOne}</b> against <b>friendId: {friends.friendId}</b></p>
      <Chessboard
      position={fen}
      />
    </div>
  );
}

export default Game;
