const express = require('express');
const {
  allMatches, newMatches, playWithFriend, playWithFriendRequests, allUserGames,
} = require('../controller/seeks');
const { newMatchesValidation, playWithFriendValidation, validateGetSeeksReq } = require('../validators/seeks');
const { runValidation } = require('../validators');

const router = express.Router();
router.get('/seeks/:userId?', validateGetSeeksReq, runValidation, allMatches);
router.post('/seeks', newMatchesValidation, runValidation, newMatches);
router.post('/withFriend', playWithFriendValidation, runValidation, playWithFriend);
router.get('/withFriendRequests/:userId?', validateGetSeeksReq, runValidation, playWithFriendRequests);
router.get('/allUserGames/:userId?', validateGetSeeksReq, runValidation, allUserGames);


module.exports = router;
