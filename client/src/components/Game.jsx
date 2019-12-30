import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import Chess from 'chess.js';
import Chessboard from 'chessboardjsx';
import axios from 'axios';
import { Link } from 'react-router-dom';

let apiUrl = 'http://localhost:8000/api';

function Game(props) {
  let [chess, updateChess] = useState(new Chess());
  let [fen, updateFen] = useState('start');
  let newFen = '';
  let [moveHistory, updateMoveHistory] = useState([]);
  let newHistory = [];
  let id = props.match.params.id;
  const [friends, setFriends] = useState([]);
  const [seeks, setSeeks] = useState([]);

  //Check for fen updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Checking for new fen.');
      axios.get(`${apiUrl}/game/${id}`)
      .then((response) => {
        console.log(response);
        newFen = response.data.fen;
        if(newFen === fen) {
          console.log('fen is unchanged.');
        }
        //If fen has changed, update fen
        if(newFen && newFen !== fen) {
          console.log('Updating fen.');
          updateFen(newFen);
        }
      });
    }, 1000);

    return () => {
      console.log('clean');
      return clearTimeout(timer);
    };
  });

  useEffect(() => {
    // axios.get('http://localhost:3000/game/333').then((res) => {
    //   console.log(res);
    // });
    axios.get(`http://localhost:8000/api/game/${id}`)
    .then((response) => {
      console.log("friends data: ",response.data);
      setFriends(response.data);
    });

    axios.get(`http://localhost:8000/api/seeks/${localStorage.getItem('userId')}`)
      .then((response) => {
        console.log("Seek data: ", response.data);
        setSeeks(response.data);
      });
  }, []);

  //Share Chess with the other player
  // useEffect(() => {
  //   axios.get(`${apiUrl}/game/${id}`)
  //   .then(({ data, err }) => {
  //     if (err) {
  //       return console.log(err);
  //     }
  //     if (data.playerOne, data.playerTwo) {
  //       const game = new Chess();
  //       const pgn = ['[Event "Casual Game"]',
  //         '[Site "Berlin GER"]',
  //         '[Date "1852.??.??"]',
  //         '[EventDate "?"]',
  //         '[Round "?"]',
  //         '[Result "1-0"]',
  //         '[White "Adolf Anderssen"]',
  //         '[Black "Jean Dufresne"]',
  //         '[ECO "C52"]',
  //         '[WhiteElo "?"]',
  //         '[BlackElo "?"]',
  //         '[PlyCount "47"]',
  //         '',
  //         '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O',
  //         'd3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4',
  //         'Bb6 14.Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6',
  //         'Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Ke8',
  //         '23.Bd7+ Kf8 24.Bxe7# 1-0'];
  //
  //       game.load_pgn(pgn.join('\n'));
  //
  //       updateChess(game);
  //       updateFen(game.fen())
  //
  //       console.log(game);
  //     }
  //   });

  // do not pick up pieces if the game is over
  // only pick up pieces for the side to move
  // function onDragStart(source, piece, position, orientation) {
  //   if (chess.game_over() === true ||
  //       (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
  //       (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
  //     return false;
  //   }
  // };

  function onDrop(sourceSquare) {
    let sourceSq = sourceSquare.sourceSquare;
    let targetSq = sourceSquare.targetSquare;
    let piece = sourceSquare.piece;
    let moveObject = {};

    moveObject = chess.move({from: sourceSq, to: targetSq});

    //If the move is acceptable, send it to the server
    if(moveObject) {

      //Creating variables
      newFen = chess.fen();
      newHistory = chess.history();

      //Update fen and history
      updateFen(newFen);
      updateMoveHistory(newHistory);

      //Send move to backend
      axios.post(`${apiUrl}/game/move`, {
        id: id,
        gameFen: newFen, //State fen cannot be used since it may not be updated yet
        gameHistory: newHistory,
        gameStyle: "standard",
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    else {
      console.log('ILLEGAL MOVE');
      //Is there a piece in the target square?
    }
  }

  function onClickReset(e) {
    chess.reset();
    updateFen(chess.fen());

    //Send reset to backend
    axios.post(`${apiUrl}/game/move`, {
      id: id,
      gameFen: 'start',
      gameHistory: [],
      gameStyle: "standard",
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div className="App">
      <Helmet><title>Game</title></Helmet>
      <Link to='/lobby' className="btn btn-primary"><button type="submit">Back to Lobby</button></Link>
      <p><b>PlayerOne: {friends.playerOne}</b> against <b>friendId: {friends.friendId}</b></p>
      <Chessboard
      position={fen}
      onDrop={onDrop}
      />
      <HistoryTable moveHistory={moveHistory}/>
      <button onClick={onClickReset}>Restart</button>
    </div>
  );
}

function HistoryTable(props) {
  let moveHistory = props.moveHistory;
  let whitePlayer = true;
  console.log(moveHistory);

  let tableRows = moveHistory.map( move => {
    if(whitePlayer) {
      return <tr><td>{move}</td></tr>;
    }
    else {
      return <td>{move}</td>;
    }
    whitePlayer = !whitePlayer;
  });

  return(
    <table>
      <thead>
        <tr>
          <th>Moves</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </table>
  );
}

export default Game;
