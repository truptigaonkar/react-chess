import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Modal(props) {
  const { show, closeModal } = props;
  const [friendname, setFriendname] = useState([]);
  const [username, setUsername] = useState([]); 
  const [seeks, setSeeks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFriendname = (e) => {
    setFriendname(e.target.value);
  }

  const handleUsername = (e) => {
    setUsername(e.target.value);
  }

  useEffect(() => {
    axios.get(`http://localhost:8000/api/seeks/${localStorage.getItem('userId')}`)
      .then((response) => {
        console.log(response.data);
        setSeeks(response.data);
      });
  }, []);

  const history = useHistory();
  const handleAddFriend = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/withFriend/', { userId: username, friendId: friendname })
      .then((response) => {
        console.log(response.data);
        history.push(`/game/${response.data._id}`);
      })
      .catch((error) => {
        console.log(error.response.data);
        setErrorMessage('Please fill all inputs and friendname should be 5 letter long');
        setTimeout(() => { setErrorMessage(''); }, 2000); // message will disappear after 2000sec.
      });
  }

  return (
    <>
      <div className={show ? "modal" : "hide"}>
        <button className="button-closeModal" onClick={closeModal}>X</button>
        <h3>Play with friend</h3>
        <p style={{ color: 'red' }}>{errorMessage}</p>
        <form onSubmit={handleAddFriend}>
          {/* <input type="text" name="username" placeholder="username" onChange={handleUsername} value={username} /> */}
          <select 
                value={username}
                onChange={handleUsername}
              >
                <option value="select">Select player</option>
                {
                  seeks.map((seek) => (
                  <>
                    <option 
                      key={seek.playerOne}
                      value={seek.playerOne}
                    >
                      {seek.playerOne}
                    </option>
                  </>
))
              }
              </select> AGAINST 
          <input type="text" name="friendname" placeholder="friendname" onChange={handleFriendname} value={friendname} />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
export default Modal;
