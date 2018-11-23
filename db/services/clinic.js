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
function getClinicDoctors(clinicId) {
  return db.query(`
    SELECT dc.doctorId, fName, lName, r.name as role from DoctorClinics dc, Doctors d, Roles r 
    where clinicId=${clinicId} and dc.DoctorId=d.doctorId and dc.DoctorRoleId=r.roleId 
  `);
}
module.exports = {
  getClinicById,
  getClinicDoctors,
  getAllClinics
};