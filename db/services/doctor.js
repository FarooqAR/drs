const Sequelize = require('sequelize');
const db = require('../');
const Doctor = require('../models/Doctor');

function getMatchingDoctor(username, password) {
  return db.query(
    `SELECT doctorId, fName, lName from Doctors WHERE username='${username}' and password='${password}'`,
    { model: Doctor }
  );
}
function getDoctorById(doctorId) {
  return db.query(
    `SELECT doctorId, fName, lName from Doctors WHERE doctorId='${doctorId}'`,
    { model: Doctor }
  );
}
function getDoctorClinics(doctorId) {
  return db.query(
    `SELECT c.clinicId, c.name as clinicName, r.name role  
    from DoctorClinics dc, Clinics c, Roles r 
    where doctorId=${doctorId} and dc.clinicId=c.clinicId and dc.DoctorRoleId=r.roleId`,
    
  );
}

function getDoctorReviews(doctorId) {
  return db.query(
    `SELECT text from Appointments, Reviews 
    where AppointReviewId=reviewId and AppointDoctorId=${doctorId}`, 
  );
}
function getDoctorQualifications(doctorId) {
  return db.query(
    `SELECT c.name as college, d.name as degree, year  
    from DoctorQualifications dq, Colleges c, Degrees d
    where DoctorCollegeDegreeId=${doctorId} and dq.DegreeId=d.degreeId and dq.CollegeId=c.collegeId`, 
  );
}
function createDoctor(doctor) {
  const { fname, lname, username, password } = doctor;
  return db.query(
    `INSERT INTO Doctors(fname, lname, username, password) OUTPUT INSERTED.doctorId, INSERTED.fName, INSERTED.lName VALUES('${fname}', '${lname}', '${username}', '${password}') `,
    { bind: [fname, lname, username, password], type: Sequelize.QueryTypes.INSERT }
  );
}
module.exports = {
  createDoctor,
  getMatchingDoctor,
  getDoctorById,
  getDoctorClinics,
  getDoctorQualifications,
  getDoctorReviews
};