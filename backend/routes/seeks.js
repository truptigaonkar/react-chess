const express = require('express');
const {
  allMatches, newMatches, playWithFriend, playWithFriendRequests, allUserGames,
} = require('../controller/seeks');
const { newMatchesValidation, playWithFriendValidation } = require('../validators/seeks');
const { runValidation } = require('../validators');

const router = express.Router();

router.get('/seeks/:userId', allMatches);
router.post('/seeks', newMatchesValidation, runValidation, newMatches);
router.post('/withFriend', playWithFriendValidation, runValidation, playWithFriend);
router.get('/withFriendRequests/:userId', playWithFriendRequests);
router.get('/allUserGames/:userId', allUserGames);


module.exports = router;
