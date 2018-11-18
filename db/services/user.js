const Sequelize = require('sequelize');
const db = require('../');
const User = require('../models/User');

function getMatchingUser(username, password) {
  return db.query(
    `SELECT userId, fName, lName from Users WHERE username='${username}' and password='${password}'`,
    { model: User }
  );
}

function createUserWithoutLocation(user) {
  const { fname, lname, username, password } = user;
  return db.query(
    `INSERT INTO Users(fname, lname, username, password) OUTPUT INSERTED.userId, INSERTED.fName, INSERTED.lName VALUES('${fname}', '${lname}', '${username}', '${password}') `,
    { bind: [fname, lname, username, password], type: Sequelize.QueryTypes.INSERT }
  );
}

module.exports = {
  getMatchingUser,
  createUserWithoutLocation,
  // createUserWithLocation
};