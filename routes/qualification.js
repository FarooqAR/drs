const express = require('express');
const router = express.Router();
const qualificationDbService = require('../db/services/qualification');
const collegeDbService = require('../db/services/college');
const degreeDbService = require('../db/services/degree');

router.get('/', function (req, res, next) {
  const doctorId = req.session.user.id;
  qualificationDbService.getCollegesByDoctorId(doctorId)
  .then(colleges => res.send(colleges))
  .catch(e => next(new Error(e)));
});


router.get('/colleges', function (req, res, next) {
  collegeDbService.getAllColleges()
  .then(colleges => res.send(colleges))
  .catch(e => next(new Error(e)));
});

router.get('/degrees', function (req, res, next) {
  degreeDbService.getAllDegrees()
  .then(degrees => res.send(degrees))
  .catch(e => next(new Error(e)));
});

module.exports = router;