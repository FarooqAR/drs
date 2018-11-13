const Sequelize = require('sequelize');
const db = require('../');

const Clinic = db.define('Clinic', {
  clinicId: {
    type: Sequelize.INTEGER, 
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lat: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  long: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  }
}, {timestamps: false});
module.exports = Clinic;
