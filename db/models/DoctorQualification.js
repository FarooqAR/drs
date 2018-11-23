const Sequelize = require('sequelize');
const db = require('../');

const DoctorQualification = db.define('DoctorQualification', {
  doctorQualificationId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  CollegeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: 'CollegeIdDegreeIdIndex'
  },
  DegreeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: 'CollegeIdDegreeIdIndex'
  },
  DoctorCollegeDegreeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}, {timestamps: false});
module.exports = DoctorQualification;
