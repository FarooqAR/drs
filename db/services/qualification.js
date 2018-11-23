const Sequelize = require('sequelize');
const db = require('../');
const DoctorQualification = require('../models/DoctorQualification');

function getCollegesByDoctorId(doctorId) {
  return db.query(`
  SELECT doctorQualificationId, c.name as college,  d.name as degree, year 
  from DoctorQualifications dq, Colleges c, Degrees d 
  where dq.DoctorCollegeDegreeId=${doctorId} and dq.CollegeId = c.collegeId and dq.DegreeId = d.degreeId
  `, { type: Sequelize.QueryTypes.SELECT });
}
function addQualification(qual, doctorId) {
  return db.query(`
  INSERT INTO DoctorQualifications(DoctorCollegeDegreeId, CollegeId, DegreeId, year) 
  VALUES($1, $2, $3, $4)
  `, {
      bind: [doctorId, qual.collegeId, qual.degreeId, qual.year],
      type: Sequelize.QueryTypes.INSERT
    });
}
function deleteQualification(qualId) {
  return db.query(`
  DELETE FROM DoctorQualifications OUTPUT DELETED.doctorQualificationId WHERE doctorQualificationId=${qualId}
  `, {model: DoctorQualification});
}
module.exports = {
  getCollegesByDoctorId,
  addQualification,
  deleteQualification
};