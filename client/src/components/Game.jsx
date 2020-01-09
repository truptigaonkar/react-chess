// import React, { useEffect, useState } from 'react';
// import Helmet from 'react-helmet';
// import Chessboard from 'chessboardjsx';
// import axios from 'axios';
// import { Link, useParams } from 'react-router-dom';
// import { URL } from "../components/config";

// function Game(props) {
//   let [fen, setFen] = useState('start');
//   let { id } = useParams();
//   const [gameData, setGameData] = useState({})
//   const [errorMessage, setErrorMessage] = useState('')

//   useEffect(() => {
//     const timer = setInterval(() => {
//       axios.get(`${URL}/api/game/${id}`)
//         .then((res) => {
//           if (res.data.err) {
//             setErrorMessage(res.data.err)
//           } else {
//             setGameData(res.data)
//             setFen(res.data.fen ? res.data.fen : 'start')
//           }
//         }).catch(error => {
//           console.log(error.response)
//           if (error.response) {
//             setErrorMessage(error.response.data.err)
//           }
//         })
//     }, 5000)
//     return () => clearTimeout(timer);
//   }, []);

//   console.log(gameData)
//   return (
//     <div className="App">
//       <Helmet><title>Game</title></Helmet>
//       <Link to='/lobby' className="btn btn-primary"><button type="submit">Back to Lobby</button></Link>
//       <p style={{ color: 'red' }}>{errorMessage}</p>
//       <Chessboard
//         position={fen}
//       />
//     </div>
//   );
// }

// export default Game;


import React, { useEffect, useState } from 'react';
import Chess from 'chess.js';
import Chessboard from 'chessboardjsx';
import { URL } from "../components/config";
import {
  useParams, useHistory,
} from 'react-router-dom';
import axios from 'axios';

const squareStyling = ({ pieceSquare, history }) => {
  const sourceSquare = history.length && history[history.length - 1].from;
  const targetSquare = history.length && history[history.length - 1].to;

  return {
    [pieceSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
    ...(history.length && {
      [sourceSquare]: {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      },
    }),
    ...(history.length && {
      [targetSquare]: {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      },
    }),
  };
};
const HumanVsHuman = ({ children, id, fen }) => {
  const [state, setState] = useState({
    game: '',
    fen: 'start',
    // square styles for active drop square
    dropSquareStyle: {},
    // custom square styles
    squareStyles: {},
    // square with the currently clicked piece
    pieceSquare: '',
    // currently clicked square
    square: '',
    // array of past game moves
    history: [],
  });
  console.log('from humanVsHuman', id)
  useEffect(() => {
    const chess = new Chess();
    chess.header('w', 'Morphy', 'b', 'basel');
    setState({ ...state, game: chess });
  }, []);
  const {
    dropSquareStyle, squareStyles, history, pieceSquare, game,
  } = state;

  // keep clicked square style and remove hint squares
  const removeHighlightSquare = () => {
    setState({
      ...state,
      squareStyles: squareStyling({ pieceSquare, history }),
    });
  };

  // show possible moves
  const highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => ({
        ...a,
        ...{
          [c]: {
            background:
              'radial-gradient(circle, #fffc00 36%, transparent 40%)',
            borderRadius: '50%',
          },
        },
        ...squareStyling({
          history,
          pieceSquare,
        }),
      }),
      {},
    );

    setState({
      ...state,
      squareStyles: { ...squareStyles, ...highlightStyles },
    });
  };

  const onDrop = ({ sourceSquare, targetSquare }) => {
    // see if the move is legal
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;
    console.log(game.header().w);
    axios.post('http://localhost:8000/api/game/move', { gameFen: game.fen(), id }).then(res => console.log(res)).catch(error => {
      console.log(error.response)
      if (error.response) {
        console.log(error.response.data.err)
      }
    })
    setState({
      ...state,
      fen: game.fen(),
      history: game.history({ verbose: true }),
      squareStyles: squareStyling({ pieceSquare, history }),
    });
  };

  const onMouseOverSquare = (square) => {
    // get list of possible moves for this square
    const moves = game.moves({
      square,
      verbose: true,
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    const squaresToHighlight = [];
    for (let i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    highlightSquare(square, squaresToHighlight);
  };

  const onMouseOutSquare = (square) => removeHighlightSquare(square);

  // central squares get diff dropSquareStyles
  const onDragOverSquare = (square) => {
    setState({
      ...state,
      dropSquareStyle:
        square === 'e4' || square === 'd4' || square === 'e5' || square === 'd5'
          ? { backgroundColor: 'cornFlowerBlue' }
          : { boxShadow: 'inset 0 0 1px 4px rgb(255, 255, 0)' },
    });
  };

  const onSquareClick = (square) => {
    setState({
      ...state,
      squareStyles: squareStyling({ pieceSquare: square, history }),
      pieceSquare: square,
    });

    const move = game.move({
      from: pieceSquare,
      to: square,
      promotion: 'q', // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    setState({
      ...state,
      fen: game.fen(),
      history: game.history({ verbose: true }),
      pieceSquare: '',
    });
  };

  const onSquareRightClick = (square) => setState({
    squareStyles: { [square]: { backgroundColor: 'deepPink' } },
  });


  return children({
    squareStyles,
    position: fen,
    onMouseOverSquare,
    onMouseOutSquare,
    onDrop,
    dropSquareStyle,
    onDragOverSquare,
    onSquareClick,
    onSquareRightClick,
    id
  });
};

const WithMoveValidation = ({ fen, id }) => (
  <div>
    <HumanVsHuman id={id} fen={fen}>
      {({
        position,
        fen,
        onDrop,
        onMouseOverSquare,
        onMouseOutSquare,
        squareStyles,
        dropSquareStyle,
        onDragOverSquare,
        onSquareClick,
        onSquareRightClick,
      }) => (
          <Chessboard
            id="humanVsHuman"
            width={320}
            position={position}
            onDrop={onDrop}
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
            boardStyle={{
              borderRadius: '5px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
            }}
            squareStyles={squareStyles}
            dropSquareStyle={dropSquareStyle}
            onDragOverSquare={onDragOverSquare}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
          />
        )}
    </HumanVsHuman>
  </div>
);

const boardsContainer = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  flexWrap: 'wrap',
  width: '100vw',
  marginTop: 30,
  marginBottom: 50,
};
const Game = () => {
  let [fen, setFen] = useState('start');
  let { id } = useParams();
  const [gameData, setGameData] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const chess = new Chess();
  useEffect(() => {
    const timer = setInterval(() => {
      axios.get(`${URL}/api/game/${id}`)
        .then((res) => {
          if (res.data.err) {
            setErrorMessage(res.data.err)
          } else {
            setGameData(res.data)
            setFen(res.data.fen ? res.data.fen : 'start')
          }
        }).catch(error => {
          console.log(error.response)
          if (error.response) {
            setErrorMessage(error.response.data.err)
          }
        })
    }, 1000)
    return () => clearTimeout(timer);
  }, []);
  console.log(gameData)
  return (
    <div>
      <div style={boardsContainer}>
        <WithMoveValidation game={chess} fen={fen} id={id} />
      </div>
    </div>
  );
};

export default Game;