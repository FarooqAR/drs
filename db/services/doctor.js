const db = require('../');
const Doctor = require('../models/Doctor');

function getMatchingDoctor(username, password) {
  return db.query(
    `SELECT doctorId, fName, lName from Doctors WHERE username='${username}' and password='${password}'`,
    { model: Doctor }
  );
}

module.exports = {
  getMatchingDoctor
};