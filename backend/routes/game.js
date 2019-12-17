const express = require('express');
const { matchData, gameMove } = require('../controller/game');

const router = express.Router();


// ● GET / api / game /: id.Returnerar all matchdata från ett pågående spel.
router.get('/game/:id', matchData);

// ● POST / api / game / move.Gör ett drag i en pågående
router.post('/game/:id/:move', gameMove);

module.exports = router;
