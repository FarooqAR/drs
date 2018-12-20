var express = require('express');
var router = express.Router();
const utils = require('../../util');
const appointmentsDbService = require('../../db/services/appointments');

router.get('/', function (req, res, next) {
  appointmentsDbService.getAllAppointments(req.session.user.id)
    .then(function (result) {
      renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
      console.log(result);
    })
});

router.post('/', function (req, res, next) {
  //res.send(appointments);
  const { clinic_name, doctor_name, date_from, date_to } = req.body;
  var from = new Date(date_from);
  var to = new Date(date_to);
    //getAppointsByClinic,

  console.log(from.getTime());
  if ((clinic_name && clinic_name.trim() != '') && isNaN(from.getTime()) && isNaN(to.getTime()) && (!doctor_name || doctor_name.trim() == '')) {
    appointmentsDbService.getAppointsByClinic(clinic_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
        else
        appointmentsDbService.getAllAppointments(req.session.user.id)
          .then(function (result) {
            renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: 'No results found for the desired clinic.' });
            console.log(result);
          })
      })
  }

    //getAppointsByDoctorname,

  else if ((doctor_name && doctor_name.trim() != '') && isNaN(from.getTime()) && isNaN(to.getTime()) && (!clinic_name || clinic_name.trim() == '')) {
    appointmentsDbService.getAppointsByDoctorname(doctor_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
        else
        appointmentsDbService.getAllAppointments(req.session.user.id)
          .then(function (result) {
            renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: 'No results found for the desired doctor.' });
            console.log(result);
          })
      })
  }

    //getAppointmentsByDate,


  else if ((!doctor_name && doctor_name.trim() == '') && from.getTime()>5 && to.getTime()>5 && (!clinic_name || clinic_name.trim() == '')) {
    appointmentsDbService.getAppointmentsByDate(from.toISOString(), to.toISOString(), req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
        else
        appointmentsDbService.getAllAppointments(req.session.user.id)
          .then(function (result) {
            renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: 'No results found between the desired dates.' });
            console.log(result);
          })
      })
  }

    //getAppointsByDoctornameAndClinic,
  
  else if ((doctor_name && doctor_name.trim() != '') && isNaN(from.getTime()) && isNaN(to.getTime()) && (clinic_name && clinic_name.trim() != '')) {
    appointmentsDbService.getAppointsByDoctornameAndClinic(doctor_name, clinic_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
        else
        appointmentsDbService.getAllAppointments(req.session.user.id)
          .then(function (result) {
            renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: 'No results found for the desired clinic and doctor.' });
            console.log(result);
          })
      })
  }

    //getAppointmentsByDateAndClinic,

  else if ((!doctor_name || doctor_name.trim() == '') && from.getTime() && to.getTime() && (clinic_name && clinic_name.trim() != '')) {
    appointmentsDbService.getAppointmentsByDateAndClinic(from.toISOString(), to.toISOString(), clinic_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
        else
        appointmentsDbService.getAllAppointments(req.session.user.id)
          .then(function (result) {
            renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: 'No results found for the desired clinic between the given dates.' });
            console.log(result);
          })
      })
  }

    //getAppointmentsByDateAndDoctor,

  else if ((doctor_name && doctor_name.trim() != '') && from.getTime() && to.getTime() && (!clinic_name || clinic_name.trim() == '')) {
    appointmentsDbService.getAppointmentsByDateAndDoctor(from.toISOString(), to.toISOString(), doctor_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
        else
        appointmentsDbService.getAllAppointments(req.session.user.id)
          .then(function (result) {
            renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: 'No results found for the desired doctor between the given dates.' });
            console.log(result);
          })
      })
  }

    //getAppointmentsByDateAndDoctorAndClinic

  else if ((doctor_name && doctor_name.trim() != '') && from.getTime() && to.getTime() && (clinic_name && clinic_name.trim() != '')) {
    appointmentsDbService.getAppointsByDoctorname(doctor_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
        else
        appointmentsDbService.getAllAppointments(req.session.user.id)
          .then(function (result) {
            renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: 'No results found for the desired clinic and doctor between the given dates.' });
            console.log(result);
          })
      })
  }

    //getAllAppointments,

  else
    appointmentsDbService.getAllAppointments(req.session.user.id)
      .then(function (result) {
        renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: "All the fields are empty. " });
        console.log(result);
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
  res.render('user/history', config);
}

module.exports = router;