const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const clinicDbService = require('../../db/services/clinic');
router.get('/', function (req, res, next) {
  clinicDbService.getAllClinics()
    .then(result => {
      res.send(result)
    })
    .catch(e => res.send({ error: e }))
});
router.get('/:clinicId', function (req, res, next) {
  clinicDbService.getClinicByDoctorId(req.params.clinicId, req.session.user.id)
    .then(result => {
      if (result.length > 0)
        res.render('doctor/clinic_details', {
          clinic: result[0],
          user: req.session.user
        })
      else
        next(createError(404));  
    })
    .catch(e =>  next(new Error('Unknown error occurred.')))
});

module.exports = router;