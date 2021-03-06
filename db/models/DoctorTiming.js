const Sequelize = require('sequelize');
const db = require('../');

const DoctorTiming = db.define('DoctorTiming', {
  doctorTimingId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  day: {
    type: Sequelize.STRING,
    allowNull: false
  },
  to: {
    type: Sequelize.STRING,
    allowNull: false
  },
  from: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ClinicDoctorId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}, {timestamps: false});
module.exports = DoctorTiming;
