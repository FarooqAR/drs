const Sequelize = require('sequelize');
const db = require('../');

const Appointment = db.define('Appointment', {
  appointmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  day: {
    type: Sequelize.STRING,
    allowNull: false
  },
  to: {
    type: Sequelize.DATE,
    allowNull: false
  },
  from: {
    type: Sequelize.DATE,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING
  },
  AppointDoctorId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  AppointUserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  AppointClinicId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  AppointReviewId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
}, {timestamps: false});

module.exports = Appointment;
