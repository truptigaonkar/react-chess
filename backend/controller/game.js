const Game = require('../models/game');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.matchData = (req, res) => {
  const { _id, newPlayer } = req.params;
  Game.findOne({ _id }).exec((err, game) => {
    if (err) {
      return res.json({ err: errorHandler(err) });
    }
    const { playerOne, playerTwo } = game;

    console.log(playerOne, playerTwo);
    if (!playerTwo && newPlayer !== playerOne) {
      game.playerTwo = newPlayer;
      game.save();
      console.log(game);
      return res.json(game);
    }
    return res.json(game);
  });
};
exports.gameMove = (req, res) => {
  res.json({ data: 'gameMove' });
};
