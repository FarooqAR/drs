const Sequelize = require('sequelize');
const db = require('../');
const Doctor = require('../models/Doctor');

function getMatchingDoctor(username, password) {
  return db.query(
    `SELECT doctorId, fName, lName from Doctors WHERE username='${username}' and password='${password}'`,
    { model: Doctor }
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
  getMatchingDoctor,
  createDoctor
};