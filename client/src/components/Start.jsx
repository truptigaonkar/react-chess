import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Grid, CssBaseline, Paper, Typography, Box, TextField, Button, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as Crown } from '../resources/crown.svg';
import { URL } from "../components/config";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/BASEL8/react-chess">
        Chess Online
      </Link>
      {new Date().getFullYear()}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
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
  useEffect(() => {
    let userId = localStorage.getItem('userId')
    if (userId) {
      setAuth(true)
    }
  }, [])
  // Handling username input
  const onChangeUsername = (e) => {
    setUsername(e.target.value);
    setErrorMessage('')
  };
  const handleAddUser = (e) => {
    e.preventDefault();
    axios.post(`${URL}/api/newUser/`, { userId: username })
      .then((res) => {
        if (res.data.err) {
          setErrorMessage(res.data.err)
        } else {
          localStorage.setItem('userId', username)
          setAuth(true)
        }
      }).catch(error => {
        console.log(error.response)
        if (error.response) {
          setErrorMessage(error.response.data.err)
        }
      })
  };
  if (auth) {
    return (
      <Redirect to="/lobby" />
    );
  }
  return (
    <>
      <Helmet><title>Chess online</title></Helmet>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Crown className={classes.logo} />
            <Typography component="h1" variant="h5">
              Chess
            </Typography>

            <form className={classes.form} onSubmit={handleAddUser} data-testid="form">
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="userId"
                label="Please enter your user ID"
                name="userId"
                helperText="User ID must be at least 5 characters long"
                autoComplete="name"
                onChange={onChangeUsername}
                autoFocus
                inputProps={{ "data-testid": "userIdInput" }}
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
export default Login;
