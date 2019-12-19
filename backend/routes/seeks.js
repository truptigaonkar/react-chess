const express = require('express');
const {
  allMatches, newMatches, acceptMatch, playWithFriend, playWithFriendRequests, allUserGames,
} = require('../controller/seeks');

const router = express.Router();

// ● GET / api / seeks.Visa alla match förslag
router.get('/seeks/:userId', allMatches);
// ● POST / api / seeks.Lägg till ett match förslag
router.post('/seeks', newMatches);
// ● POST / api / seeks /: id.Acceptera ett match - förslag
router.post('/seeks/:id', acceptMatch);
// ● POST / api / seeks / - spela med en kompis
router.post('/withFriend', playWithFriend);
// ● POST / api / seeks / - spela med en kompis
router.get('/withFriendRequests/:userId', playWithFriendRequests);

router.get('/allUserGames/:userId', allUserGames);


module.exports = router;
