/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Helmet from 'react-helmet';

const Lobby = () => {
  const [seeks, setSeeks] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/seeks/${localStorage.getItem('userId')}`)
      .then((response) => {
        // console.log(response.data);
        setSeeks(response.data);
      });
  }, []);

  if (!seeks) {
    return <p>Loading seeks...</p>;
  }

  return (
    <>
      <Helmet><title>Lobby</title></Helmet>
      <table>
        <thead>
          <tr>
            <th>Player One</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {seeks.map((seek) => (
            <>
              <tr key={seek.id}>
                <td>{seek.playerOne}</td>
                <td>
                  <button type="submit">Play</button>
                  {' '}
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
