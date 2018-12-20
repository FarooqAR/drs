const Sequelize = require('sequelize');
const db = require('../');

function addAffiliation(aff) {
  return db.query(`
  INSERT INTO DoctorClinics(DoctorId, ClinicId, DoctorRoleId)
  OUTPUT INSERTED.doctorClinicId VALUES($1, $2, $3)`,
    { type: Sequelize.QueryTypes.INSERT, 
      bind: [aff.doctorId, aff.clinicId, aff.roleId] });
}
function getAffiliation(doctorId) {
  return db.query(`SELECT doctorClinicId, cl.clinicId, cl.name as clinic, r.name as role 
   from DoctorClinics dc, Clinics cl, Roles r
   where dc.DoctorId=${doctorId} and dc.ClinicId=cl.clinicId and dc.DoctorRoleId=r.roleId 
  `,
    { type: Sequelize.QueryTypes.SELECT });
}
function isAffiliated(doctorId, clinicId) {
  return db.query(`SELECT doctorClinicId
   from DoctorClinics
   where DoctorId=${doctorId} and ClinicId=${clinicId}
  `,
    { type: Sequelize.QueryTypes.SELECT });
}
function deleteAffiliations(doctorClinicId) {
  return db.query(`DELETE FROM DoctorClinics WHERE doctorClinicId=${doctorClinicId}
  `,
    { type: Sequelize.QueryTypes.DELETE });
}
module.exports = {
  addAffiliation,
  getAffiliation,
  isAffiliated,
  deleteAffiliations
};