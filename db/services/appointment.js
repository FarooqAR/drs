const Sequelize = require('sequelize');
const db = require('../');
const Appointment = require('../models/Appointment');

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
  changeStatus
};