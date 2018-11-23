const Sequelize = require('sequelize');
const db = require('../');

function addTiming(doctorClinicId, timing) {
  return db.query(`
    INSERT INTO DoctorTimings(ClinicDoctorId, day, [to], [from]) OUTPUT INSERTED.doctorTimingId 
    VALUES($1, $2, $3, $4)
  `, {
      type: Sequelize.QueryTypes.INSERT,
      bind: [doctorClinicId, timing[1], timing[2], timing[3]]
    });
}
function getTimings(doctorClinicId) {
  return db.query(`
    SELECT doctorTimingId, day, [to], [from] FROM DoctorTimings where ClinicDoctorId=${doctorClinicId}
  `, {
      type: Sequelize.QueryTypes.SELECT
    });
}
function deleteTimings(doctorClinicId) {
  return db.query(`
    DELETE FROM DoctorTimings where ClinicDoctorId=${doctorClinicId}
  `, {
      type: Sequelize.QueryTypes.DELETE
    });
}
module.exports = {
  addTiming,
  getTimings,
  deleteTimings
}