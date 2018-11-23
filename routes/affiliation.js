const express = require('express');
const router = express.Router();
const affiliationDbService = require('../db/services/affiliation');

router.post('/', function (req, res, next) {
  affiliationDbService.getAffiliation(req.session.user.id)
    .then(result => res.send(result))
    .catch(error => res.send({ error }));
})

module.exports = router;