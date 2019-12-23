const express = require('express');
const { matchData, gameMove, playGame } = require('../controller/game');
const { gameMoveValidationValidation, playGameValidationValidation } = require('../validators/game');
const { runValidation } = require('../validators');

const router = express.Router();


router.get('/game/:_id', matchData);
router.post('/game/move', gameMoveValidationValidation, runValidation, gameMove);
router.post('/game/play', playGameValidationValidation, runValidation, playGame);

module.exports = router;
