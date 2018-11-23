const express = require('express');
const router = express.Router();
const clinicDbService = require('../db/services/clinic');

router.get('/', function (req, res, next) {
  clinicDbService.getAllClinics()
    .then(result => {
      res.send(result)
    })
    .catch(e => res.send({ error: e }))
});

module.exports = router;