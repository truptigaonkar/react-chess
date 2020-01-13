const Game = require('../models/game');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.matchData = (req, res) => {
  const { _id } = req.params;
  Game.findOne({ _id }).exec((err, game) => {
    if (err) {
      return res.json({ err: errorHandler(err) });
    }
    return res.json(game);
  });
};
exports.playGame = (req, res) => {
  const { id, playerTwo } = req.body;
  Game.findOne({ _id: id }).exec((err, game) => {
    if (err) {
      return res.json({ err: errorHandler(err) });
    }
    if (!game) {
      return res.json({ err: 'no game with this id exists' });
    }
    if (game.w) {
      game.b = playerTwo
    } else {
      game.w = playerTwo
    }
    game.started = true;
    game.playerTwo = playerTwo;
    game.save();
  });
};
exports.gameMove = (req, res) => {
  const {
    id, gameHistory, gameFen, gameStyle,
  } = req.body;
  Game.findById({ _id: id }).exec((err, game) => {
    if (err) {
      return res.json({ err: errorHandler(err) });
    }
    if (!game) {
      return res.json({ err: 'no game with this id ' });
    }
    if (typeof gameStyle !== 'object') {
      return res.json({ err: 'gameStyle must be an object' });
    }
    game.history = gameHistory;
    game.fen = gameFen;
    game.squareStyles = gameStyle;
    game.save();
    const { fen, history, squareStyles } = game;
    return res.json({ fen, history, squareStyles });
  });
};

exports.deleteGame = (req, res) => {
  const { id, userId } = req.body;

  Game.findById(id).exec((err, game) => {
    if (err) {
      return res.json({ err: errorHandler(err) });
    }
    if (!game) {
      return res.json({ err: 'this game is not available on database' });
    }
    if (game) { 
      if (userId === game.playerOne && !game.playerTwo) {
        game.remove();
        return res.json({ message: 'this game has been successfully deleted' });
      }
      return res.json({ message: `you cannot delete a game created by ${game.playerOne}` });
    }
  });
};
