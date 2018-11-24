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

function updateUserWithLocation(user){
  console.log('inside dbuserloc');
  console.log(user.x);
  return db.query(
    `UPDATE Users SET lat = ${user.x}, long = ${user.y} WHERE userId like ${user.username}`,
    { bind: [user.username, user.x, user.y], type: Sequelize.QueryTypes.UPDATE }
  )
}

module.exports = {
  getMatchingUser,
  updateUserWithLocation,
  createUserWithoutLocation
};