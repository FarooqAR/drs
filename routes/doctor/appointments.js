// route handler for /appointments and /appointments/:id
var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  // get the appointment from db
  if (id > 10) { // sample demo to show error when something's wrong  
    return next();
  }
  const appointment = [
    id,
    'Jalal', // name
    '3/3/13', // created_at
    'Monday', // day
    '3:00 AM', // from
    '4:00 AM', // to
    'pending', // status
    'meri sehat kharaab he meri sehat kharaab he', // description
  ]
  res.render('doctor/appoint_details', {
    appointment
  });
});

module.exports = router;