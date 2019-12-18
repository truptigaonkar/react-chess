const express = require('express');
const { allMatches, newMatches, acceptMatch } = require('../controller/seeks');

const router = express.Router();

// ● GET / api / seeks.Visa alla match förslag
router.get('/seeks', allMatches);
// ● POST / api / seeks.Lägg till ett match förslag
router.post('/seeks', newMatches);
// ● POST / api / seeks /: id.Acceptera ett match - förslag
router.post('/seeks/:id', acceptMatch);

module.exports = router;
