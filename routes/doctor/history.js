var express = require('express');
const appointmentsDbService = require('../../db/services/appointments');
var router = express.Router();
const utils = require('../../util');
const doctorClinics = [
  [
    "0", "Indus Hospital", "General Physician",
    [
      [0, 'Monday', '04:55', '06:00'],
      [1, 'Wednesday', '04:55', '06:00']
    ]
  ],
  [
    "1", "Civil Hospital", "Dentist",
    [
      [0, 'Friday', '04:55', '06:00'],
    ]
  ]
];

router.get('/', function (req, res, next) {
  appointmentsDbService.getAllAppointmentsD(req.session.user.id)
    .then(function (result) {
      renderView(res, {
        user: req.session.user,
        fullName: req.session.user.fName + ' ' + req.session.user.lName,
        appointments: normalizeAppointments(result)
      });
    })
});

router.post('/', function (req, res, next) {
  //res.send(appointments);
  const { clinic_name, patient_name, date_from, date_to } = req.body;
  var from = new Date(date_from);
  var to = new Date(date_to);
  
  //getAppointsByClinic,
  if ((clinic_name && clinic_name.trim() != '') && isNaN(from.getTime()) && isNaN(to.getTime()) && (!patient_name || patient_name.trim() == '')) {
    appointmentsDbService.getAppointsByClinicD(clinic_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
        else
          appointmentsDbService.getAllAppointmentsD(req.session.user.id)
            .then(function (result) {
              renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: 'No results found for the desired clinic.' });
              console.log(result);
            })
      })
  }
  //getAppointsByDoctorname,

  else if ((patient_name && patient_name.trim() != '') && isNaN(from.getTime()) && isNaN(to.getTime()) && (!clinic_name || clinic_name.trim() == '')) {
    appointmentsDbService.getAppointsByUsername(patient_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
        else
          appointmentsDbService.getAllAppointmentsD(req.session.user.id)
            .then(function (result) {
              renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: 'No results found for the desired patient.' });
              console.log(result);
            })
      })
  }

  //getAppointmentsByDate,


  else if ((!patient_name && patient_name.trim() == '') && from.getTime() > 5 && to.getTime() > 5 && (!clinic_name || clinic_name.trim() == '')) {
    console.log("date wali condition.")
    appointmentsDbService.getAppointmentsByDateD(from.toISOString(), to.toISOString(), req.session.user.id)
      .then(result => {

        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
        else
          appointmentsDbService.getAllAppointmentsD(req.session.user.id)
            .then(function (result) {
              renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: 'No results found between the provided dates.' });
              console.log(result);
            })
      })
  }

  //getAppointsByDoctornameAndClinic,

  else if ((patient_name && patient_name.trim() != '') && isNaN(from.getTime()) && isNaN(to.getTime()) && (clinic_name && clinic_name.trim() != '')) {
    appointmentsDbService.getAppointsByUsernameAndClinic(patient_name, clinic_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
        else
          appointmentsDbService.getAllAppointmentsD(req.session.user.id)
            .then(function (result) {
              renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: 'No results found for the desired clinic and patient.' });
              console.log(result);
            })
      })
  }

  //getAppointmentsByDateAndClinic,

  else if ((!patient_name || patient_name.trim() == '') && from.getTime() && to.getTime() && (clinic_name && clinic_name.trim() != '')) {
    appointmentsDbService.getAppointmentsByDateAndClinicD(from.toISOString(), to.toISOString(), clinic_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
        else
          appointmentsDbService.getAllAppointmentsD(req.session.user.id)
            .then(function (result) {
              renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: 'No results found for the desired clinic between the given dates.' });
              console.log(result);
            })
      })
  }

  //getAppointmentsByDateAndDoctor,

  else if ((patient_name && patient_name.trim() != '') && from.getTime() && to.getTime() && (!clinic_name || clinic_name.trim() == '')) {
    appointmentsDbService.getAppointmentsByDateAndUser(from.toISOString(), to.toISOString(), patient_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
        else
          appointmentsDbService.getAllAppointmentsD(req.session.user.id)
            .then(function (result) {
              renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: 'No results found for the desired patient between the given dates.' });
              console.log(result);
            })
      })
  }

  //getAppointmentsByDateAndDoctorAndClinic

  else if ((patient_name && patient_name.trim() != '') && from.getTime() && to.getTime() && (clinic_name && clinic_name.trim() != '')) {
    appointmentsDbService.getAppointmentsByDateAndUserAndClinic(from.toISOString(), to.toISOString(), patient_name, clinic_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result) });
        else
          appointmentsDbService.getAllAppointmentsD(req.session.user.id)
            .then(function (result) {
              renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: normalizeAppointments(result), error: 'No results found for the desired clinic and patient between the given dates.' });
              console.log(result);
            })
      })
  }

  //getAllAppointments,

  else
    appointmentsDbService.getAllAppointmentsD(req.session.user.id)
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
  config.clinics = doctorClinics;
  //config.appointments = [];
  res.render('doctor/history', config);
}

module.exports = router;