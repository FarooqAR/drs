var express = require('express');
var router = express.Router();
const doctorDbService = require('../../db/services/doctor');

router.get('/:id', function (req, res, next) {
  const id = req.params.id;
  doctorDbService.getDoctorById(id)
    .then(result => {
      if (result[0]) {
        return res.render('user/doctor_details', {
          doctor: result[0].dataValues,
          user: req.session.user
        });
      }
      next(new Error('404: Not found'));
    })
    .catch(() => next(new Error('404: Not found')))

});

router.get('/:id/clinics', function (req, res, next) {
  const id = req.params.id;
  doctorDbService.getDoctorClinics(id)
    .then(result => {
      res.send(result);
    })
    .catch((err) => res.send({ error: err }))
});

router.get('/:id/qualifications', function (req, res, next) {
  const id = req.params.id;
  doctorDbService.getDoctorQualifications(id)
    .then(result => {
      res.send(result);
    })
    .catch((err) => res.send({ error: err }))
});

module.exports = router;