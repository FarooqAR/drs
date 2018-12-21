var express = require('express');
var router = express.Router();
const clinicsDbService = require('../../db/services/clinic');
const doctorsDbService = require('../../db/services/doctor');
const rolesDbService = require('../../db/services/role');
const {days} = require('../../constants') 
var allClinics = [];
var allDoctors = [];
var allRoles = [];

function renderView(res, config) {
  res.render(`user/dashboard`, config);
}

router.get('/', async function (req, res, next) {

  try {
    var clinics = await clinicsDbService.getAllClinics();
    var doctors = await doctorsDbService.getAllDoctors();
    var roles = await rolesDbService.getAllRoles();
    createAllClinincsList(clinics);
    createAllDoctorsList(doctors);
    createAllRolesList(roles);
    renderView(res, {
      fullName: 'Patient',
      user: req.session.user,
      clinics: allClinics,
      doctors: allDoctors,
      roles: allRoles,
      days
    });
  } catch (error) {
    renderView(res, {
      fullName: 'Patient',
      user: req.session.user,
      clinics: allClinics,
      doctors: allDoctors,
      roles: allRoles,
      days
    });
  }
});

router.post('/clinics', function (req, res, next) {
  const [clinic, doctor, role, day] = req.body;
  var set;
  
  if (!clinic && !doctor && !role && !day) {  // if no filters
    res.send(allClinics);
  }
  else if (!doctor && !role && !day) {  // filtered by clinic
    clinicsDbService.getClinicByName(clinic)
      .then(function (result) {
        res.send(sendClinic(result));
      })
  }
  else if (!clinic && !role && !day) {  // filtered by doctor
    clinicsDbService.getDoctorClinics(getDoctorId(doctor))
      .then(function (result) {
        res.send(sendClinic(result));
      })
  }

  else if (!clinic && !doctor && !day) {  // filtered by roles
    clinicsDbService.getRoleClinics(role)
      .then(function (result) {
        res.send(sendFILTEREDClinics(result))
      })
  }

  else if (!clinic && !doctor && !role) {  // filtered by day
    clinicsDbService.getDayClinics(day)
      .then(function (result) {
        res.send(sendFILTEREDClinics(result));
      })
  }

  else if (!doctor && !day) { // filtered by clinic and role 
    clinicsDbService.getRole_ClinicClinics(role, clinic)
      .then(function (result) {
        res.send(sendFILTEREDClinics(result));
      })
  }

  else if (!doctor && !clinic) { // filtered by role and day
    clinicsDbService.getRole_DayClinics(role, day)
      .then(function (result) {
        console.log(result);
        res.send(sendFILTEREDClinics(result));
      })
  }

  else if (!clinic && !role) { // filtered by doctor and day
    clinicsDbService.getDoctor_DayClinics(day, getDoctorId(doctor))
      .then(function (result) {
        console.log(result)
        res.send(sendFILTEREDClinics(result));
      })
  }

  else if (!doctor && !role) { // by clinics and day
    clinicsDbService.getClinic_DayClinics(day, clinic)
      .then(function (result) {
        console.log(result)
        res.send(sendFILTEREDClinics(result));
      })
  }

  else if (!doctor) {  //filtered by clinic and role and day
    clinicsDbService.getRole_Clinic_DayClinics(role, clinic, day)
      .then(function (result) {
        res.send(sendFILTEREDClinics(result));
      })
  }
});

function createAllClinincsList(result) {
  allClinics = []; // empty out if populated
  console.log(result)
  for (clinic in result) {
    allClinics.push([result[clinic].name, result[clinic].lat, result[clinic].long, result[clinic].clinicId])
  }
  console.log(allClinics);
}

function createAllDoctorsList(result) {
  allDoctors = []; // empty out if populated
  for (doctor in result) {
    allDoctors.push([result[doctor].doctorId, result[doctor].fName + " " + result[doctor].lName])
  }
}

function getDoctorId(name) {
  for (doctor in allDoctors) {
    if (name == allDoctors[doctor][1]) {
      return allDoctors[doctor][0];
    }
  }
}

function createAllRolesList(result) {
  allRoles = []; // empty out if populated
  for (role in result) {
    allRoles.push(result[role].name)
  }
}

function sendClinic(result) {
  var list = [];
  for (loc in result) {
    list.push([result[loc].name, result[loc].lat, result[loc].long, result[loc].clinicId]);
  }
  return list;
}

function sendFILTEREDClinics(result) {
  var list = [];
  for (i in result) {
    var clinic = result[i].name;
    var doctor = result[i].doctorId;
    var infoText = 'Dr. ' + result[i].fName + ' ' + result[i].lName;
    // fit into the infowindow all other doctors who specialize in the same field in the same hospital
    for (j in result) {
      if (clinic == result[j].name && doctor != result[j].doctorId) {
        infoText += ', ' + result[j].fName + ' ' + result[j].lName;
      }
    }
    infoText += ' at ' + clinic;
    list.push([infoText, result[i].lat, result[i].long, result[i].clinicId]);
  }
  return list;
}


module.exports = router;