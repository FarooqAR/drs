var express = require('express');
var router = express.Router();
const clinicDbService = require('../../db/services/clinic');

router.get('/:id', function (req, res, next) {
  const id = req.params.id;
  clinicDbService.getClinicById(id)
    .then(result => {
      if (result[0]) {
        return res.render('user/clinic_details', {
          clinic: result[0].dataValues,
          user: req.session.user
        });
      }
      next(new Error('404: Not found'));
    })
    .catch(() => next(new Error('404: Not found')))

});

router.get('/:id/doctors', function (req, res, next) {
  const id = req.params.id;
  clinicDbService.getClinicDoctors(id)
    .then(result => {
      res.send(result);
    })
    .catch((err) => res.send({ error: err }))
});

module.exports = router;