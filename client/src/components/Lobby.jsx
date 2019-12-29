/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Helmet from 'react-helmet';
import { Redirect, Link } from 'react-router-dom';
import { URL } from "../components/config";

const Lobby = () => {
  const [seeks, setSeeks] = useState([]);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    axios.get(`${URL}/api/seeks/${localStorage.getItem('userId')}`)
      .then((response) => {
        setSeeks(response.data);
      });
  }, []);

  if (!seeks) {
    return <p>Loading seeks...</p>;
  }

  const handleLogout = (e) => {
    e.preventDefault();
    setLogin(true);
  };

  if (login) {
    return (
      <Redirect to="/" />
    );
  }
  return (
    <>
      <Helmet><title>Lobby</title></Helmet>
      <button type="submit" onClick={handleLogout}>Logout</button>
      <table border='1px solid black'>
        <thead>
          <tr>
            <th>_id</th>
            <th>Player One</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {seeks.map((seek) => (
            <>
              <tr key={seek.id}>
                <td>{seek._id}</td>
                <td>{seek.playerOne}</td>
                <td>
                  <Link to={`/game/${seek._id}`} className="btn btn-primary"><button type="submit">Play</button></Link>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Lobby;

