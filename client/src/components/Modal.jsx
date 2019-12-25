import React, {useState} from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

function Modal(props) {
  const { show, closeModal } = props;
  const [friendname, setFriendname] = useState([]);

  const handleFriendname = (e) => {
    setFriendname(e.target.value);
  }

  const handleAddFriend = (e) =>{
    e.preventDefault();
    axios.post('http://localhost:8000/api/withFriend/', { userId: localStorage.getItem('userId'), friendId:friendname })
      .then((res) => {    
          console.log(res); 
      })
      .catch((error) => {
        console.log(error);
      });

  }

  return (
    <>
      <div className={show ? "modal" : "hide"}>
        <button className="button-closeModal" onClick={closeModal}>X</button>
        <h3>Play with friend</h3>
        <form onSubmit={handleAddFriend}>
        <input type="text" name="friendname" placeholder="friendname" onChange={handleFriendname} value={friendname}/>
        <button type="submit">Add Friend</button>
        </form>
      </div>
    </>
  );
}

export default Modal;