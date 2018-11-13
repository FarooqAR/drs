const Sequelize = require('sequelize');
const db = require('../');

const College = db.define('College', {
  collegeId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {timestamps: false});

module.exports = College;
