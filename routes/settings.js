// this module will handle settings for user and doctor

var express = require('express');
var router = express.Router();
var qualifications = [
  ["0", "HabibUni", "CS", "1998"],
  ["1", "AghaKhan", "MBBS", "2011"]

];
router.get('/', function(req, res, next) {
  renderView(res, {
    fullName: 'Farooq AR',
    firstTimer: true, 
    qualifications
  });
});

router.post('/add/qualification', function (req, res, next) {
  const qualification = req.body;
  qualification.unshift(qualifications.length);
  qualifications.push(qualification);
  // we can also send objects (json) 
  res.send({
    qualifications
  })
});

router.post('/delete/qualification', function (req, res, next) {
  const qualificationId = req.body.id;
  for (let i = 0; i < qualifications.length; i++) {
    const id = qualifications[i][0];
    if (id == qualificationId) {
      qualifications.splice(i, 1);
      break;
    }
  }
  res.send({
    qualifications
  });
});

function renderView(res, config) {
  config.roles = [
    'General Physician',
    'Surgeon',
    'Dentist',
    'Eye Specialist'
  ];
  config.days = [
    'Monday', 
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  config.qualifications = config.qualifications || [];
  res.render('doctor/settings', config);
}
module.exports = router;