const { check } = require('express-validator');
// id, gameHistory, gameFen, gameStyle,
exports.gameMoveValidationValidation = [
  check('id')
    .not()
    .isEmpty()
    .withMessage('id is required')
    .isString()
    .withMessage('it must be string'),
  check('gameHistory')
    .isArray()
    .withMessage('gameHistory must be an array'),
  check('gameFen')
    .not()
    .isEmpty()
    .withMessage('gameFen is required')
    .isString()
    .withMessage('it must be string'),
  check('gameStyle')
    .not()
    .isEmpty()
    .withMessage('gameStyle is required'),
];
exports.playGameValidationValidation = [
  check('id')
    .not()
    .isEmpty()
    .withMessage('id is required')
    .isString()
    .withMessage('id must be string'),
  check('playerTwo')
    .not()
    .isEmpty()
    .withMessage('playerTwo is required')
    .isString()
    .withMessage('it must be string'),
];
