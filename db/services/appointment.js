const Sequelize = require('sequelize');
const db = require('../');
const Appointment = require('../models/Appointment');

function getCurrentAppointmentsByUser(userId) {
  let query = `SELECT appointmentId, Clinics.name as clinicName,(fName+' '+lName) as doctorFullName, [from],[to], [status]
  FROM Appointments, Clinics, Doctors
  WHERE [status] in ('pending', 'new')
  AND clinicId = AppointClinicId 
  AND doctorId = AppointDoctorId
  AND AppointUserId = ${userId}`;
  
  return db.query(
    query, { type: Sequelize.QueryTypes.SELECT }
  );
}

function getCurrentAppointments(clinicId, doctorId) {
  let query = `SELECT appointmentId, Clinics.name as clinicName,(Users.fName+' '+Users.lName) as patientFullName, [from],[to], [status]
  FROM Appointments, Clinics, Users
  WHERE [status] in ('pending', 'new')
  AND userId = AppointUserId
  AND clinicId = AppointClinicId 
  AND AppointDoctorId = ${doctorId}`;

  if (clinicId > -1)
    query += ` AND clinicId = ${clinicId}`;
  return db.query(
    query, { type: Sequelize.QueryTypes.SELECT }
  );
}

function create(appointment) {
  const { from, to, description, doctorId, userId, clinicId } = appointment;
  return db.query(`
  INSERT INTO Appointments([from], [to], description, status, AppointDoctorId, AppointUserId, AppointClinicId, createdAt)
  OUTPUT INSERTED.appointmentId
  VALUES($1, $2, $3, $4, $5, $6, $7, SYSDATETIME()) 
  `,
    {
      type: Sequelize.QueryTypes.INSERT,
      bind: [from, to, description, 'new', doctorId, userId, clinicId],
      model: Appointment
    })
}
function get(appointmentId, user) {
  const reverseType = user.type == 'user' ? 'doctor' : 'user';
  let query = `
  SELECT [from], [to], description, status, ${reverseType}Id, clinicId, reviewId, (d.fName + ' ' + d.lName) as ${reverseType}FullName, c.name as clinicName, r.text as review, rating, a.createdAt
  FROM ${reverseType}s d, Clinics c, Appointments a left join Reviews r on 
   AppointReviewId=reviewId
   WHERE appointmentId=${appointmentId}
   and a.AppointClinicId=clinicId 
   and a.Appoint${reverseType}Id=${reverseType}Id and a.Appoint${user.type}Id=${user.id}`;

  return db.query(query, {
    type: Sequelize.QueryTypes.SELECT
  });
}
function get(appointmentId, user) {
  const reverseType = user.type == 'user' ? 'doctor' : 'user';
  let query = `
  SELECT [from], [to], description, status, ${reverseType}Id, clinicId, reviewId, (d.fName + ' ' + d.lName) as ${reverseType}FullName, c.name as clinicName, r.text as review, rating, a.createdAt
  FROM ${reverseType}s d, Clinics c, Appointments a left join Reviews r on 
   AppointReviewId=reviewId
   WHERE appointmentId=${appointmentId}
   and a.AppointClinicId=clinicId 
   and a.Appoint${reverseType}Id=${reverseType}Id and a.Appoint${user.type}Id=${user.id}`;

  return db.query(query, {
    type: Sequelize.QueryTypes.SELECT
  });
}
function changeStatus(appointId, doctorId, status) {
  return db.query(
    `UPDATE Appointments SET status='${status}' WHERE appointmentId=${appointId} and AppointDoctorId=${doctorId}`,
    {
      type: Sequelize.QueryTypes.UPDATE
    }
  );
}
module.exports = {
  create,
  get,
  changeStatus,
  getCurrentAppointments,
  getCurrentAppointmentsByUser
};