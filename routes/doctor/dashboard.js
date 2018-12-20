var express = require('express');
var router = express.Router();
const appointmentDbService = require('../../db/services/appointment');
const utils = require('../../util');

router.get('/', async function (req, res, next) {
  const { clinic } = req.query;
  try {
    var appointments = await appointmentDbService.getCurrentAppointments(clinic, req.session.user.id);
    appointments = normalizeAppointments(appointments);
    renderView(res, {
      fullName: req.session.user.fName + ' ' + req.session.user.lName,
      user: req.session.user,
      currentAppointments: appointments.filter(a => a.status == "pending"),
      newAppointments: appointments.filter(a => a.status == "new"),
    });
  } catch (error) {
    console.log(error);
  }
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

function normalizeAppointments(appointments) {
  return appointments.map(appointment => {
    appointment.from.setHours(appointment.from.getHours() - 5);
    appointment.to.setHours(appointment.to.getHours() - 5);
    appointment.date = appointment.from.toDateString();
    appointment.from = utils.formatAMPM(appointment.from);
    appointment.to = utils.formatAMPM(appointment.to);
    return appointment;
  })
}
function renderView(res, config) {
  res.render(`doctor/dashboard`, config);
}

module.exports = router;