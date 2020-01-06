/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Helmet from 'react-helmet';
import { Redirect, Link } from 'react-router-dom';
import { URL } from "../components/config";
import { TableContainer, Table, TableHead, TableRow, TableCell,TableBody, Paper, Button, Breadcrumbs, Typography, CssBaseline, Container, Grid } from '@material-ui/core';
import Modal from '../components/Modal';

const Lobby = () => {
  const [seeks, setSeeks] = useState([]);
  const [login, setLogin] = useState(false);
  //Modal
  const [show, setShow] = useState(false);
  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);

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
<Modal closeModal={closeModal} show={show} />
<Grid container spacing={3}>

<Grid item xs={6}>
      <TableContainer component={Paper} style={{width:'300px', height: '550px'}}>
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
              <TableCell align="right"><Link to={`/game/${seek._id}`} style={{ textDecoration: 'none' }}><Button type="submit" variant="contained" color="primary" size="small">PLAY</Button></Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Grid>
    <Grid item xs={6}>
      <div><button><Link to={`/`}>CREATE A PLAYER</Link></button></div>
     <div>{!show && <button onClick={openModal}>PLAY WITH FRIEND</button>}</div>
     </Grid>
     </Grid>
    </Container>
    </>
  );
};

export default Lobby;

