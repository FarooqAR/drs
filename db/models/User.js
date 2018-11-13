const Sequelize = require('sequelize');
const db = require('../');

const User = db.define('User', {
  userId: {
    type: Sequelize.INTEGER, 
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lat: {
    type: Sequelize.FLOAT
  },
  long: {
    type: Sequelize.FLOAT
  }
}, {timestamps: false});
module.exports = User;
