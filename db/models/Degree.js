const Sequelize = require('sequelize');
const db = require('../');


const Degree = db.define('Degree', {
  degreeId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {timestamps: false})

module.exports = Degree;
