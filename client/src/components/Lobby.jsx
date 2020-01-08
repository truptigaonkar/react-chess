/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Helmet from 'react-helmet';
import { Redirect, Link } from 'react-router-dom';
import { URL } from "../components/config";
import { TableContainer, Table, TableHead, TableRow, TableCell,TableBody, Paper, Button, Breadcrumbs, Typography, CssBaseline, Container, Grid, ButtonGroup,  } from '@material-ui/core';
import Modal from '../components/Modal';
import { makeStyles } from '@material-ui/core/styles';

const Lobby = () => {
  const [seeks, setSeeks] = useState([]);
  const [login, setLogin] = useState(false);
  //Modal
  const [show, setShow] = useState(false);
  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);


  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));
  const classes = useStyles();
  

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
    <div className={classes.root}>
      <Helmet><title>Lobby</title></Helmet>
      
      <Container>
      <Breadcrumbs aria-label="breadcrumb">
  <Link color="inherit" href="/" onClick={handleLogout}>
    Start
  </Link>
  <Typography color="textPrimary">Lobby</Typography>
</Breadcrumbs><br />

<Grid container spacing={3}>
<Grid item xs={12} sm={6}>
<paper className={classes.paper}>
      <TableContainer component={Paper} style={{ height: '550px'}}>
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
    </paper>
    </Grid>
    <Grid item xs={12} sm={6}>
      <paper className={classes.paper}>
      <ButtonGroup
  orientation="vertical"
  color="primary"
  aria-label="vertical outlined primary button group"
>
<Button><Link to={`/`} style={{ textDecoration: 'none' }}>CREATE A PLAYER</Link></Button>
  {!show && <Button onClick={openModal}>PLAY WITH FRIEND</Button>}
  <Button>PLAY WITH COMPUTER</Button>
</ButtonGroup>

<Modal closeModal={closeModal} show={show} />
     </paper>
     </Grid>
     </Grid>
    </Container>
    </div>
  );
};

export default Lobby;

