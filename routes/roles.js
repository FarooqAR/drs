const express = require('express');
const router = express.Router();
const roleDbService = require('../db/services/role');

router.get('/', function (req, res, next) {
  roleDbService.getAllRoles()
  .then(result => res.send(result))
  .catch(e => res.send({ error: e }));
});


module.exports = router;