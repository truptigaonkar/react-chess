
import React, { useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

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
      <p style={{ color: 'red' }}>{errorMessage}</p>
      <form onSubmit={handleAddUser}>
        <input type="text" name="username" placeholder="Enter Username...." minLength="3" maxLength="40" onChange={handleUsername} value={username} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default Login;
