const express = require('express');
const clinicDbService = require('../../db/services/clinic');
const doctorDbService = require('../../db/services/doctor');
const affiliationDbService = require('../../db/services/affiliation');
const timingDbService = require('../../db/services/doctor_timing');
const appointDbService = require('../../db/services/appointment');
const constants = require('../../constants');
const utils = require('../../util');
const appointGetHandler = require('../appointments');
const router = express.Router();

router.get('/', async function (req, res, next) {
  try {
    var appointments = await appointDbService.getCurrentAppointmentsByUser(req.session.user.id);
    appointments = normalizeAppointments(appointments);
    res.render('user/appointments', {
      fullName: req.session.user.fName + ' ' + req.session.user.lName,
      user: req.session.user,
      appointments
    });
  } catch (error) {
    console.log(error);
  }
});
router.get('/:appointmentId', appointGetHandler);

router.get('/create/:doctorId/:clinicId', async function (req, res, next) {
  const { doctorId, clinicId } = req.params;
  try {
    var clinic = (await clinicDbService.getClinicById(clinicId))[0];
    var doctor = (await doctorDbService.getDoctorById(doctorId))[0];
    if (!clinic || !doctor)
      throw new Error('Invalid clinicId or doctorId');
    clinic = clinic.dataValues;
    doctor = doctor.dataValues;
    const { doctorClinicId } = (await affiliationDbService.isAffiliated(doctorId, clinicId))[0];
    if (doctorClinicId == undefined)
      throw new Error('Doctor is not affialiated');

    const timings = await timingDbService.getTimings(doctorClinicId);
    res.render('user/create_appointment', {
      clinic, doctor, timings,
      user: req.session.user
    })
  } catch (error) {
    next(error);
  }

});

router.post('/create/:doctorId/:clinicId', async function (req, res, next) {
  const { doctorId, clinicId } = req.params;
  let { date, days, tos, froms, to, from, description, clinic_name, fName, lName } = req.body;

  let doctor = { fName, lName, doctorId };
  let clinic = { name: clinic_name, clinicId };
  if (!Array.isArray(days)) {
    days = [days];
    tos = [tos];
    froms = [froms];
  }
  let timings = serializeTimings(days, tos, froms);
  if (!date || !to || !from) {
    return sendError('Missing Fields');
  }
  let d1 = new Date(date);
  let d2 = new Date();
  d2 = new Date(d2.toLocaleString());
  if (d1.getTime() < d2.getTime()) {
    return sendError('Date is past');
  }

  const selectedDayIndex = days.indexOf(constants.days[d1.getDay()]);
  if (!~selectedDayIndex) {
    return sendError('Select one of the days from the given schedule');
  }
  if (to < tos[selectedDayIndex] ||
    to > froms[selectedDayIndex] ||
    from < tos[selectedDayIndex] ||
    from > froms[selectedDayIndex] ||
    to <= from) {
    return sendError('Invalid Time');
  }

  const appointment = {
    from: `${d1.toLocaleDateString()} ${from}`,
    to: `${d1.toLocaleDateString()} ${to}`,
    description,
    userId: req.session.user.id,
    doctorId,
    clinicId
  };

  appointDbService.create(appointment)
    .then(result => {
      if (result[0] && result[0][0] && result[0][0].appointmentId != undefined) {
        return res.redirect(`/appointments/${result[0][0].appointmentId}`);
      }
      sendError('An unknown error occurred.');
    })
    .catch(e => {
      console.log(e);
      sendError('An unknown error occurred.');
    });

  function sendError(error) {
    res.render('user/create_appointment', {
      clinic, doctor, timings,
      user: req.session.user,
      date, to, from, description,
      error
    })
  }

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
function serializeTimings(days, tos, froms) {
  return days.map((day, i) => ({ day, to: tos[i], from: froms[i] }))
}
module.exports = router;