
import React, { useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  TextField, Button,
} from '@material-ui/core';

const Login = () => {
  const [username, setUsername] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [auth, setAuth] = useState(false);

  // Handling username input
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  // Handlling form submit
  const handleAddUser = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/seeks/', { userId: username })
      .then(() => {
        setUsername('');
        setAuth(true);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setErrorMessage('You must fill in username');
          setTimeout(() => { setErrorMessage(''); }, 2000); // message will disappear after 2000sec.
        }
      });
  };

  if (auth) {
    return (
      <Redirect to="/lobby" />
    );
  }
  return (
    <div>
      <Helmet><title>Login</title></Helmet>
      <div className="login-form">
        <form onSubmit={handleAddUser}>
          <p style={{ color: 'red' }}>{errorMessage}</p>
          <TextField id="standard-basic" label="Username" name="username" placeholder="Leo Forsberg" minLength="3" maxLength="40" onChange={handleUsername} value={username} />
          <br />
          <br />
          <Button type="submit" variant="contained" color="primary">LOGIN</Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
