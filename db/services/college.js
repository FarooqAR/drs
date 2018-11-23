const Sequelize = require('sequelize');
const db = require('../');

function getAllColleges() {
  return db.query(`SELECT * from Colleges`, {type: Sequelize.QueryTypes.SELECT});
}
function getCollegesByDoctorId(doctorId) {
  return db.query(`
  SELECT c.name as college,  d.name as degree, year 
  from DoctorQualifications dq, Colleges c, Degrees d 
  where dq.DoctorCollegeDegreeId=${doctorId} and dq.CollegeId = c.collegeId and dq.DegreeId = d.degreeId
  `, {type: Sequelize.QueryTypes.SELECT});
}
module.exports = {
  getAllColleges,
  getCollegesByDoctorId
};