const db = require('../');
const User = require('../models/User');

function getMatchingUser(username, password) {
  return db.query(
    `SELECT userId, fName, lName from Users WHERE username='${username}' and password='${password}'`,
    { model: User }
  );
}

module.exports = {
  getMatchingUser
};