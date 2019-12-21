
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState([]);

  // Handling username input
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  // Handlling form submit
  const handleAddUser = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/seeks/', { userId: username })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={handleAddUser}>
        <input type="text" name="username" placeholder="Enter Username...." onChange={handleUsername} value={username} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default Login;
