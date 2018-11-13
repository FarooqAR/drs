const Sequelize = require('sequelize');
const db = require('../');

const Review = db.define('Review', {
  reviewId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 10 }
  }
}, {timestamps: false})
module.exports = Review;
