var express = require('express');
var router = express.Router();
const clinicsDbService = require('../../db/services/clinic');
const doctorsDbService = require('../../db/services/doctor');
const rolesDbService = require('../../db/services/role');

var allClinics = [];
var allDoctors = [];
var allRoles = [];
const days = {0: 'Sunday', 1: 'Monday', 2:'Tuesday', 3: 'Wednesday', 4:'Thursday', 5:'Friday', 6:'Saturday'};

function renderView(res, config) {
  res.render(`user/dashboard`, config);
}

router.get('/', function (req, res, next) {

  // get all clinics
  clinicsDbService.getAllClinics()
    .then(function (result) {
      createAllClinincsList(result);
    })
  // get all doctors
  doctorsDbService.getAllDoctors()
    .then(function(result){
      createAllDoctorsList(result);
    })
  // get all roles
  rolesDbService.getAllRoles()
    .then(function(result){
      createAllRolesList(result);
    })


  renderView(res, {
    fullName: 'Patient',
    user: req.session.user,
    clinics: allClinics,
    doctors: allDoctors,
    roles: allRoles
  });
  console.log(req.session.user);
});

router.post('/clinics', function (req, res, next) {
  const [ clinic, doctor, role, date ] = req.body;
  console.log(req.body);
  var set;
  // create js formatted date if available
  if (date){
    set = new Date(date);
  }
  if (!clinic && !doctor && !role && !date){  // if no filters
    res.send(allClinics);
  }
  else if (!doctor && !role && !date){  // filtered by clinic
    clinicsDbService.getClinicByName(clinic)
    .then (function (result){
      res.send(sendClinic(result));
    })
  }
  else if (!clinic && !role && !date){  // filtered by doctor
    clinicsDbService.getDoctorClinics(getDoctorId(doctor))
    .then (function (result){
      res.send(sendDoctorClinics(result));
    })
  }

  else if (!clinic && !doctor && !date){  // filtered by roles
    clinicsDbService.getRoleClinics(role)
    .then (function (result) {
      console.log(result);
      res.send(sendFILTEREDClinics(result))
    })
  }

  else if (!clinic && !doctor && !role){  // filtered by day
    clinicsDbService.getDayClinics(days[set.getDay()])
    .then (function (result) {
      res.send(sendFILTEREDClinics(result));
    })
  }

  else if (!doctor && !date){ // filtered by clinic and role 
      clinicsDbService.getRole_ClinicClinics(role, clinic)
      .then (function (result) {
        res.send(sendFILTEREDClinics(result));
      })
  }

  else if (!doctor && !clinic){ // filtered by role and day
    clinicsDbService.getRole_DayClinics(role, days[set.getDay()])
    .then (function (result) {
      console.log(result);
      res.send(sendFILTEREDClinics(result));
    })
  }

  else if (!clinic && !role){ // filtered by doctor and day
    clinicsDbService.getDoctor_DayClinics(days[set.getDay()], getDoctorId(doctor))
    .then (function (result) {
      console.log(result)
      res.send(sendFILTEREDClinics(result));
    })
  }

  else if (!doctor && !role){ // by clinics and day
    clinicsDbService.getClinic_DayClinics(days[set.getDay()], clinic)
    .then (function (result) {
      console.log(result)
      res.send(sendFILTEREDClinics(result));
    })
  }

  else if (!doctor){  //filtered by clinic and role and day
    clinicsDbService.getRole_Clinic_DayClinics(role, clinic, days[set.getDay()])
    .then(function (result) {
      res.send(sendFILTEREDClinics(result));
    })
  }
});

function createAllClinincsList(result){
    allClinics = []; // empty out if populated
    for (clinic in result){
      allClinics.push([result[clinic].name, result[clinic].lat, result[clinic].long])
    }
}

function createAllDoctorsList(result){
  allDoctors = []; // empty out if populated
  for (doctor in result){
    allDoctors.push([result[doctor].doctorId,result[doctor].fName+" "+result[doctor].lName])
  }
}

function getDoctorId(name){
  for (doctor in allDoctors){
    if (name == allDoctors[doctor][1]){
      return allDoctors[doctor][0];
    }
  }
}

function createAllRolesList(result){
  allRoles = []; // empty out if populated
  for (role in result){
    allRoles.push(result[role].name)
  }
}

function sendClinic(clinic){
  var list = [];
  for (loc in clinic){
    list.push([clinic[loc].name, clinic[loc].lat, clinic[loc].long]);
  }
  return list;
}

function sendDoctorClinics(doctor){
  var list = [];
  for (clinic in doctor){
    list.push([doctor[clinic].name, doctor[clinic].lat, doctor[clinic].long]);
  }
  return list;
}

function sendFILTEREDClinics(result){
  var list = [];
  for (i in result){
    var clinic = result[i].name;
    var doctor = result[i].doctorId;
    var infoText = 'Dr. '+result[i].fName+' '+result[i].lName;
    // fit into the infowindow all other doctors who specialize in the same field in the same hospital
    for (j in result){
      if (clinic == result[j].name && doctor != result[j].doctorId){
        infoText += ', '+result[j].fName+' '+result[j].lName;
      }
    }
    infoText += ' at '+clinic;
    list.push([infoText, result[i].lat, result[i].long]);
  }
  return list;
}


module.exports = router;