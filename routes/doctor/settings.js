// this module will handle settings for doctor

const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();

const { days } = require('../../constants');
const qualificationDbService = require('../../db/services/qualification');
const affiliationDbService = require('../../db/services/affiliation');
const timingDbService = require('../../db/services/doctor_timing');

router.get('/', function (req, res, next) {
  const config = {
    fullName: req.session.user.fName + ' ' + req.session.user.lName,
    user: req.session.user,
    firstTimer: req.query.new === "true",
    days
  };
  res.render('doctor/settings', config);
});

router.post('/add/qualification', function (req, res, next) {
  const qualification = req.body;
  qualificationDbService.addQualification({
    collegeId: +qualification[0],
    degreeId: +qualification[1],
    year: +qualification[2]
  }, req.session.user.id)
    .then(() => {
      res.send({
        qualification
      })

    })
    .catch(error => {
      if (error.name == 'SequelizeUniqueConstraintError') {
        error = 'Duplicate qualification';
      }
      res.send({ error })
    })
});

router.post('/delete/qualification', function (req, res, next) {
  const qualificationId = req.body.id;
  qualificationDbService.deleteQualification(qualificationId)
    .then(result => {
      res.send(result[0].dataValues);
    }).catch(e => res.send({ error: e }))
});

router.post('/add/affiliation', function (req, res, next) {
  const { clinic, timings } = req.body;
  const [clinicId, roleId] = clinic;
  let doctorClinicId;
  affiliationDbService.addAffiliation({
    clinicId,
    roleId,
    doctorId: req.session.user.id
  })
    .then(result => {
      doctorClinicId = result[0][0].doctorClinicId;
      return Promise.all(
        timings.map(timing => timingDbService.addTiming(doctorClinicId, timing))
      );
    })
    .then(() => res.send({ doctorClinicId }))
    .catch(error => {
      if (error.name == 'SequelizeUniqueConstraintError') {
        error = 'Duplicate clinic';
      }
      res.send({ error })
    })
});

router.post('/delete/clinic', function (req, res, next) {
  const { doctorClinicId } = req.body;
  timingDbService.deleteTimings(doctorClinicId)
    .then(result => affiliationDbService.deleteAffiliations(doctorClinicId))
    .then(() => res.send({}))
    .catch(error => res.send({ error }))
});

router.post('/delete/clinic_timing', function (req, res, next) {
  const { clinicId, timingId } = req.body;
  outer:
  for (let i = 0, l = doctorClinics.length; i < l; i++) {
    const clinic = doctorClinics[i];
    const timings = clinic[3];

    if (clinic[0] == clinicId) { // found the desired clinic

      for (let j = 0, k = timings.length; j < k; j++) {

        if (timings[j][0] == timingId) { // found the desired timing

          timings.splice(j, 1);
          // remove the whole clinic if it has no timings
          if (timings.length == 0) {
            doctorClinics.splice(i, 1);
          }
          break outer;
        }
      }
    }
  }
  res.send({
    clinics: doctorClinics
  })
});

module.exports = router;