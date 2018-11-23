const express = require('express');
const router = express.Router();
const timingDbService = require('../db/services/doctor_timing');

router.post('/', function (req, res, next) {
  const { doctorClinicId } = req.body;
  if (doctorClinicId == undefined)
    return res.send({error: 'Provide doctor clinic id'});
  timingDbService.getTimings(doctorClinicId)
    .then(result => res.send(result))
    .catch(e => res.send({ error: e }));
});

module.exports = router;