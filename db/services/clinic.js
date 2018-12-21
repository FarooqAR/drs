const Sequelize = require('sequelize');
const db = require('../');
const Clinic = require('../models/Clinic');

function getAllClinics() {
  return db.query(`SELECT * from Clinics`, { type: Sequelize.QueryTypes.SELECT });
}

function getClinicById(clinicId) {
  return db.query(`
    SELECT * from Clinics where clinicId=${clinicId}
  `, { model: Clinic });
}
function getClinicsByDoctorId(doctorId) {
  return db.query(`
    SELECT c.clinicId, name, lat, long, address from Clinics c, DoctorClinics d 
    where c.clinicId=d.ClinicId and d.DoctorId=${doctorId}
  `, { type: Sequelize.QueryTypes.SELECT });
}
function getClinicByDoctorId(clinicId, doctorId) {
  return db.query(`
    SELECT c.clinicId, c.name, lat, long, address, r.name as role from Clinics c, DoctorClinics d, Roles r 
    where d.clinicId=c.clinicId and c.clinicId=${clinicId} and d.DoctorId=${doctorId} and DoctorRoleId=r.roleId
  `, { type: Sequelize.QueryTypes.SELECT });
}

function getClinicByName(name){
return db.query(`SELECT name, lat, long, clinicId FROM Clinics WHERE name like '%${name}%'`, {type:Sequelize.QueryTypes.SELECT})
}

function getDoctorClinics(doctorId){
  return db.query(`SELECT Clinics.name, lat, long, Clinics.clinicId
  FROM DoctorClinics, Doctors, Clinics
  WHERE DoctorClinics.DoctorId = Doctors.doctorId
    and DoctorClinics.ClinicId = Clinics.clinicId
    and Doctors.doctorId = ${doctorId}`, {type:Sequelize.QueryTypes.SELECT});
}

function getRoleClinics(role){
  return db.query(`SELECT fName, lName, Doctors.doctorId, Clinics.name, lat, long, Clinics.clinicId
  FROM DoctorClinics, Roles, Doctors, Clinics
  WHERE roleId = DoctorRoleId
      and doctors.doctorid = doctorclinics.DoctorId
      and Clinics.clinicId = DoctorClinics.ClinicId
      and Roles.name like '%${role}%'`, {type:Sequelize.QueryTypes.SELECT});
}

function getClinicDoctors(clinicId) {
  return db.query(`
    SELECT dc.doctorId, fName, lName, r.name as role from DoctorClinics dc, Doctors d, Roles r 
    where clinicId=${clinicId} and dc.DoctorId=d.doctorId and dc.DoctorRoleId=r.roleId 
  `);
}

function getDayClinics(day){
  return db.query(`SELECT fName, lName, Clinics.name, Doctors.doctorId, lat, long, Clinics.clinicId
  FROM DoctorTimings, DoctorClinics, Doctors, Clinics
  WHERE [day] = '${day}'
      and doctorClinics.doctorClinicid = clinicDoctorId
      and Doctors.doctorId = DoctorClinics.DoctorId
      and Clinics.clinicId = DoctorClinics.ClinicId`, {type:Sequelize.QueryTypes.SELECT})
}

function getRole_ClinicClinics(role, clinic){
  return db.query(`SELECT fName, lName, Clinics.name, lat, long, Doctors.doctorId, Clinics.clinicId
  FROM DoctorClinics, Doctors, Roles, Clinics
  WHERE DoctorClinics.DoctorId = Doctors.doctorId
      and DoctorRoleId = roleId
      and DoctorClinics.ClinicId = Clinics.clinicId
      and Clinics.name like '%${clinic}%'
      and Roles.name like '%${role}%'`, {type:Sequelize.QueryTypes.SELECT});
}

function getRole_DayClinics(role, day){
  return db.query(`SELECT fName, lName, Clinics.name, Doctors.doctorId, lat, long, Clinics.clinicId
  FROM DoctorClinics, Doctors, Roles, Clinics, DoctorTimings
  WHERE DoctorClinics.DoctorId = Doctors.doctorId
      and doctorClinicId = ClinicDoctorId
      and DoctorRoleId = roleId
      and DoctorClinics.ClinicId = Clinics.clinicId
      and Roles.name like '%${role}%
      and [day] = '${day}'`, {type:Sequelize.QueryTypes.SELECT});
}

function getClinic_DayClinics(day, clinic){
  return db.query(`SELECT fName, lName, Clinics.name, Doctors.doctorId, lat, long, Clinics.clinicId
  FROM DoctorClinics, Doctors, Roles, Clinics, DoctorTimings
  WHERE DoctorClinics.DoctorId = Doctors.doctorId
      and doctorClinicId = ClinicDoctorId
      and DoctorRoleId = roleId
      and DoctorClinics.ClinicId = Clinics.clinicId
      and Clinics.name like '%${clinic}%'
      and [day] = '${day}'`, {type:Sequelize.QueryTypes.SELECT});
}

function getDoctor_DayClinics(day, doctor){
  return db.query(`SELECT fName, lName, Clinics.name, lat, long, Clinics.clinicId
  FROM DoctorClinics, Doctors,Clinics, DoctorTimings
  WHERE DoctorClinics.DoctorId = Doctors.doctorId
      and doctorClinicId = ClinicDoctorId
      and DoctorClinics.ClinicId = Clinics.clinicId
      and Doctors.doctorId = ${doctor}
      and [day] = '${day}'`, {type:Sequelize.QueryTypes.SELECT});
}

function getRole_Clinic_DayClinics(role, clinic, day){
  return db.query(`SELECT fName, lName, Clinics.name, Doctors.doctorId, lat, long, Clinics.clinicId
  FROM DoctorClinics, Doctors, Roles, Clinics, DoctorTimings
  WHERE DoctorClinics.DoctorId = Doctors.doctorId
      and doctorClinicId = ClinicDoctorId
      and DoctorRoleId = roleId
      and DoctorClinics.ClinicId = Clinics.clinicId
      and Clinics.name like '%${clinic}%'
      and Roles.name like '%${role}%'
      and [day] = '${day}'
  `, {type:Sequelize.QueryTypes.SELECT});
}

module.exports = {
  getClinicById,
  getClinicDoctors,
  getAllClinics,
  getClinicsByDoctorId,
  getClinicByDoctorId,
  getClinicByName,
  getDoctorClinics,
  getRoleClinics,
  getDayClinics,
  getRole_ClinicClinics,
  getRole_DayClinics,
  getClinic_DayClinics,
  getRole_Clinic_DayClinics,
  getDoctor_DayClinics
};