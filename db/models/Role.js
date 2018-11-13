const Sequelize = require('sequelize');
const db = require('../');

const Role = db.define('Role', {
  roleId: {
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
module.exports = Role;
