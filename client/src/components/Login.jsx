
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Grid, CssBaseline, Paper, Typography, Avatar, FormControlLabel, Checkbox, Box, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {ReactComponent as Crown} from '../resources/crown.svg';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Chess Online
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    //backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  logo: {
    height: '5vh',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const classes = useStyles();

  const [username, setUsername] = useState([]); 
  const [errorMessage, setErrorMessage] = useState('');
  const [auth, setAuth] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // Handling username input
  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  // Handlling form submit
  const handleAddUser = (e) => {
    e.preventDefault();
    //localStorage.setItem('userId', username )
    axios.post('http://localhost:8000/api/seeks/', { userId: username })
      .then((res) => {      
        //setUsername('');
        setAuth(true);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setErrorMessage('Please fill out your name');
          setTimeout(() => { setErrorMessage(''); }, 2000); // message will disappear after 2000sec.
        }
      });
  };

  const toggleChange = () => {
    setIsChecked(!isChecked);
  }

  if (auth) {
    return (
      <Redirect to="/lobby" />
    );
  }

  if (!isChecked) {
    return (
      <>
      <Helmet><title>Chess online</title></Helmet>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Crown className={classes.logo} />
  {/*           <Avatar className={classes.avatar}>
              <Crown />
            </Avatar> */}
            <Typography component="h1" variant="h5">
              Chess
            </Typography>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Add player"
              checked={isChecked}
          onChange={toggleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              data-testid="button"
              href="/lobby"
            >
              Enter
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </div>
        </Grid>
      </Grid>
      </>
    );
  }else{
  return (
    <>
    <Helmet><title>Chess online</title></Helmet>
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Crown className={classes.logo} />
{/*           <Avatar className={classes.avatar}>
            <Crown />
          </Avatar> */}
          <Typography component="h1" variant="h5">
            Chess
          </Typography>
       <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Add player"
              checked={isChecked}
          onChange={toggleChange}
            />
          <form className={classes.form} onSubmit={handleAddUser}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="userId"
              label="Player name"
              name="userId"
              helperText="Enter your name to play chess online"
              autoComplete="name"
              onChange={onChangeUsername}
              autoFocus
            />
            <p style={{ color: 'red' }}>{errorMessage}</p>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              data-testid="button"
            >
              Enter
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
    </>
  );
        }
}
export default Login;
