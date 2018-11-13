const Sequelize = require('sequelize');
const db = require('../');

const DoctorClinic = db.define('DoctorClinic', {
  doctorClinicId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  DoctorId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  ClinicId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  DoctorRoleId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
}, {timestamps: false});
module.exports = DoctorClinic;
