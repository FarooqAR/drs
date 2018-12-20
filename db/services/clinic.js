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
function getClinicDoctors(clinicId) {
  return db.query(`
    SELECT dc.doctorId, fName, lName, r.name as role from DoctorClinics dc, Doctors d, Roles r 
    where clinicId=${clinicId} and dc.DoctorId=d.doctorId and dc.DoctorRoleId=r.roleId 
  `);
}
module.exports = {
  getClinicById,
  getClinicDoctors,
  getAllClinics,
  getClinicsByDoctorId,
  getClinicByDoctorId
};