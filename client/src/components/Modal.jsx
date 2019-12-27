import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Redirect, Link, useParams } from 'react-router-dom';

function Modal(props) {
  const { show, closeModal } = props;
  const [friendname, setFriendname] = useState([]);
  const [seeks, setSeeks] = useState([]);
  const [auth, setAuth] = useState(false);
  const [friends, setFriends] = useState([]);

  const { id } = useParams();

  const handleFriendname = (e) => {
    setFriendname(e.target.value);
  }

  const handleAddFriend = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/withFriend/', { userId: localStorage.getItem('userId'), friendId: friendname })
      .then((response) => {
        console.log(response);
        setFriends(response.data);
        setAuth(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (auth) {
    return (
      <Redirect
        to={`/game/${friends._id}`}
      />
    );
  }

  return (
    <>
      <div className={show ? "modal" : "hide"}>
        <button className="button-closeModal" onClick={closeModal}>X</button>
        <h3>Play with friend</h3>
        <form onSubmit={handleAddFriend}>
          <input type="text" name="friendname" placeholder="friendname" onChange={handleFriendname} value={friendname} />
          <button type="submit">Add Friend</button>
        </form>


      </div>
    </>
  );
}

export default Modal;