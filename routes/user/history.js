var express = require('express');
var router = express.Router();
const appointmentsDbService = require('../../db/services/appointments');

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
  appointmentsDbService.getAllAppointments(req.session.user.id)
    .then(function (result) {
      renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result });
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
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result });
        else
        appointmentsDbService.getAllAppointments(req.session.user.id)
          .then(function (result) {
            renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result, error: 'No results found for the desired clinic.' });
            console.log(result);
          })
      })
  }

    //getAppointsByDoctorname,

  else if ((doctor_name && doctor_name.trim() != '') && isNaN(from.getTime()) && isNaN(to.getTime()) && (!clinic_name || clinic_name.trim() == '')) {
    appointmentsDbService.getAppointsByDoctorname(doctor_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result });
        else
        appointmentsDbService.getAllAppointments(req.session.user.id)
          .then(function (result) {
            renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result, error: 'No results found for the desired doctor.' });
            console.log(result);
          })
      })
  }

    //getAppointmentsByDate,


  else if ((!doctor_name && doctor_name.trim() == '') && from.getTime()>5 && to.getTime()>5 && (!clinic_name || clinic_name.trim() == '')) {
    appointmentsDbService.getAppointmentsByDate(from.toISOString(), to.toISOString(), req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result });
        else
        appointmentsDbService.getAllAppointments(req.session.user.id)
          .then(function (result) {
            renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result, error: 'No results found between the desired dates.' });
            console.log(result);
          })
      })
  }

    //getAppointsByDoctornameAndClinic,
  
  else if ((doctor_name && doctor_name.trim() != '') && isNaN(from.getTime()) && isNaN(to.getTime()) && (clinic_name && clinic_name.trim() != '')) {
    appointmentsDbService.getAppointsByDoctornameAndClinic(doctor_name, clinic_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result });
        else
        appointmentsDbService.getAllAppointments(req.session.user.id)
          .then(function (result) {
            renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result, error: 'No results found for the desired clinic and doctor.' });
            console.log(result);
          })
      })
  }

    //getAppointmentsByDateAndClinic,

  else if ((!doctor_name || doctor_name.trim() == '') && from.getTime() && to.getTime() && (clinic_name && clinic_name.trim() != '')) {
    appointmentsDbService.getAppointmentsByDateAndClinic(from.toISOString(), to.toISOString(), clinic_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result });
        else
        appointmentsDbService.getAllAppointments(req.session.user.id)
          .then(function (result) {
            renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result, error: 'No results found for the desired clinic between the given dates.' });
            console.log(result);
          })
      })
  }

    //getAppointmentsByDateAndDoctor,

  else if ((doctor_name && doctor_name.trim() != '') && from.getTime() && to.getTime() && (!clinic_name || clinic_name.trim() == '')) {
    appointmentsDbService.getAppointmentsByDateAndDoctor(from.toISOString(), to.toISOString(), doctor_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result });
        else
        appointmentsDbService.getAllAppointments(req.session.user.id)
          .then(function (result) {
            renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result, error: 'No results found for the desired doctor between the given dates.' });
            console.log(result);
          })
      })
  }

    //getAppointmentsByDateAndDoctorAndClinic

  else if ((doctor_name && doctor_name.trim() != '') && from.getTime() && to.getTime() && (clinic_name && clinic_name.trim() != '')) {
    appointmentsDbService.getAppointsByDoctorname(doctor_name, req.session.user.id)
      .then(result => {
        if (result.length > 0)
          renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result });
        else
        appointmentsDbService.getAllAppointments(req.session.user.id)
          .then(function (result) {
            renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result, error: 'No results found for the desired clinic and doctor between the given dates.' });
            console.log(result);
          })
      })
  }

    //getAllAppointments,

  else
    appointmentsDbService.getAllAppointments(req.session.user.id)
      .then(function (result) {
        renderView(res, { user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result, error: "All the fields are empty. " });
        console.log(result);
      })
  //else
  //     if (data.clinic_name && data.clinic_name.trim() != '')
  //     if ((isNaN(from.getTime()) && !isNaN(to.getTime())) || (!isNaN(from.getTime()) && isNaN(to.getTime()))) {
  // console.log(clinic_name, doctor_name, date_from, date_to);
  //console.log("YAHAN PER ANA CHAHIYE")
  // appointmentsDbService.getAppointsByClinic(clinic_name, req.session.user.id)
  // .then(result => {
  //   renderView(res,{ user: req.session.user, fullName: req.session.user.fName + ' ' + req.session.user.lName, appointments: result });
  // })
});




function renderView(res, config) {
  config.clinics = doctorClinics;
  //config.appointments = [];
  res.render('user/history', config);
}

module.exports = router;