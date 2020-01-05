/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Helmet from 'react-helmet';
import { Redirect, Link } from 'react-router-dom';
import { URL } from "../components/config";
import { TableContainer, Table, TableHead, TableRow, TableCell,TableBody, Paper, Button, Breadcrumbs, Typography, CssBaseline, Container } from '@material-ui/core';

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
      <Container>
      <Breadcrumbs aria-label="breadcrumb">
  <Link color="inherit" href="/" onClick={handleLogout}>
    Start
  </Link>
  <Typography color="textPrimary">Lobby</Typography>
</Breadcrumbs><br />
      <TableContainer component={Paper} style={{width:'250px'}}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Players</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {seeks.map(seek => (
            <TableRow key={seek._id}>
              <TableCell component="th" scope="seek">
                {seek.playerOne}
              </TableCell>
              <TableCell align="right"><Link to={`/game/${seek._id}`} style={{ textDecoration: 'none' }}><Button type="submit" variant="contained" color="primary" size="small">Play</Button></Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Container>
    </>
  );
};

export default Lobby;

