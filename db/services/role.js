const Sequelize = require('sequelize');
const db = require('../');

function getAllRoles() {
  return db.query(`SELECT * from Roles`, {type: Sequelize.QueryTypes.SELECT});
}
module.exports = {
  getAllRoles,
};