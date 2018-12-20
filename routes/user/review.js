const express = require('express');
const router = express.Router();
const reviewDbService = require('../../db/services/review');

router.post('/create', function (req, res, next) {
  const { reviewValue, appointmentId } = req.body;
  reviewDbService.create(reviewValue)
    .then(result => {
      const review = result[0][0];
      if (review) {
        return reviewDbService.linkToAppointment(appointmentId, review.reviewId)
      }
      else {
        res.send({ error: 'Could not create review' });
      }
    })
    .then(result => {
      if (result[1]) // result[1] gives affected rows count
        res.send({ reviewId: review.reviewId });
      else
        res.send({ error: 'Could not update appointment' });
    })
    .catch(e => next(e));

});

router.post('/:reviewId/edit', function (req, res, next) {
  const { reviewId } = req.params;
  const { reviewValue } = req.body;
  reviewDbService.edit(reviewId, reviewValue)
    .then(result => {
      res.send(result);
    });

});

module.exports = router;