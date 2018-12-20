const Sequelize = require('sequelize');
const db = require('../');
const Review = require('../models/Review');

function create(reviewValue) {
  return db.query(`
  INSERT INTO Reviews(text, rating) OUTPUT [INSERTED].reviewId VALUES('${reviewValue}', 1)
  `, {
    type: Sequelize.QueryTypes.INSERT,
    model: Review
  })
}

function edit(reviewId, reviewValue) {
  return db.query(`
  UPDATE Reviews SET text='${reviewValue}' WHERE reviewId=${reviewId} 
  `, {
    type: Sequelize.QueryTypes.UPDATE,
    model: Review
  });
}

function linkToAppointment(appointId, reviewId) {
  return db.query(`
  UPDATE Appointments SET AppointReviewId=${reviewId} WHERE appointmentId=${appointId} 
  `, {
    type: Sequelize.QueryTypes.UPDATE,
  });
}
module.exports = {
  create,
  edit,
  linkToAppointment
};