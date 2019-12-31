const { check } = require('express-validator');

exports.newMatchesValidation = [
  check('userId')
    .not()
    .isEmpty()
    .withMessage('user id is required')
    .isString()
    .withMessage('is string')
    .isLength({ min: 5 })
    .withMessage('must be at least 5 letters long'),
];
exports.playWithFriendValidation = [
  check('friendId')
    .not()
    .isEmpty()
    .withMessage('friendId id is required')
    .isString()
    .withMessage('is string')
    .isLength({ min: 5 })
    .withMessage('friendId must be at least 5 letters long'),
  check('userId')
    .not()
    .isEmpty()
    .withMessage('userId id is required')
    .isString()
    .withMessage('is string')
    .isLength({ min: 5 })
    .withMessage('userId must be at least 5 letters long'),
];
