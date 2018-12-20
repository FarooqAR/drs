var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
  renderView(res, {
    fullName: req.session.user.fName + ' ' + req.session.user.lName,
    user: req.session.user,
    currentAppointments: [],
    newAppointments: [],
  });
});

router.post('/filter/status', function (req, res, next) {
  const { appointmentid, stat } = req.body;
  for (appointment in appointments) {
    if (appointment == appointmentid) {
      appointments[appointment][6] = stat;
      break;
    }
  }
  res.send({
    appointments
  })
});


function renderView(res, config) {
  res.render(`doctor/dashboard`, config);
}

module.exports = router;