const Sequelize = require('sequelize');
const db = require('../');

function getAllDegrees() {
  return db.query(`SELECT * from Degrees`, {type: Sequelize.QueryTypes.SELECT});
}
module.exports = {
  getAllDegrees,
};