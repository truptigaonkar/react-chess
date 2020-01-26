import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center'
  },
  button: {
    marginTop: 15
  }
}));

const TransitionsModal = ({ openWithFriendModal, setOpenWithFriendModal, userId }) => {
  const classes = useStyles();
  const history = useHistory()
  const [friendId, setFriendId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const handleClose = () => {
    setOpenWithFriendModal(false)
  };

  const playWithFriend = () => {
    axios.post('http://localhost:8000/api/withFriend/', { userId, friendId })
      .then((res) => {
        if (res.data.err) {
          setErrorMessage(res.data.err)
        } else {
          history.push(`/game/${res.data._id}`);
        }
      }).catch(error => {
        if (error.response) {
          setErrorMessage(error.response.data.err)
        }
      })
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openWithFriendModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openWithFriendModal}>
          <div className={classes.paper}>
            <p>please insert your friend id</p>
            <TextField required id="standard-required" onChange={(e) => setFriendId(e.target.value)} defaultValue={friendId} />
            <Button variant="contained" className={classes.button} onClick={playWithFriend}>send request</Button>
            <p style={{ color: 'red', marginTop: 15 }}>{errorMessage}</p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
export default TransitionsModal;