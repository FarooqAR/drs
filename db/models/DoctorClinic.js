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
    unique: 'DoctorIdClinicIdIndex'
  },
  ClinicId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: 'DoctorIdClinicIdIndex'
  },
  DoctorRoleId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
}, {timestamps: false});
module.exports = DoctorClinic;
