const { check, param } = require('express-validator');

exports.validateGetSeeksReq = [
  param('userId')
    .not()
    .isEmpty()
    .withMessage('user id is required')
    .isString()
    .withMessage('userId must be a string string'),
];
exports.newMatchesValidation = [
  check('userId')
    .not()
    .isEmpty()
    .withMessage('userId is required')
    .isString()
    .withMessage('is string')
    .isLength({ min: 5 })
    .withMessage('userId must be at least 5 characters long'),
];
exports.playWithFriendValidation = [
  check('friendId')
    .not()
    .isEmpty()
    .withMessage('friendId is required')
    .isString()
    .withMessage('is string')
    .isLength({ min: 5 })
    .withMessage('friendId must be at least 5 characters long'),
  check('userId')
    .not()
    .isEmpty()
    .withMessage('userId is required')
    .isString()
    .withMessage('is string')
    .isLength({ min: 5 })
    .withMessage('userId must be at least 5 characters long'),
];
