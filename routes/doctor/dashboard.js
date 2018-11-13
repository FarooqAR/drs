var express = require('express');
var router = express.Router();

const doctorClinics = [
  [
    "0", "Indus Hospital", "General Physician",
    [
      [0, 'Monday', '04:55', '06:00'],
      [1, 'Wednesday', '04:55', '06:00']
    ]
  ],
  [
    "1", "Civil Hospital", "Dentist",
    [
      [0, 'Friday', '04:55', '06:00'],
    ]
  ]
];
const appointments = [
  ['1', 'Civil Hospital', 'Hiba Jamal', 'Nov 8, 2018', '04:55', '05:30',
    "accepted", "01:00", 'null'],
  ['2', "Indus Hospital", "Faizan Boi", 'Apr 27, 2019', "04:55", "05:30",
    "new", "12:00", "null"],
  ['3', "AKUH", "Kainat Boi", "Apr 28, 2019", "04:55", "05:30",
    "new", "12:00", "null"],
  ['4', "Parklane", "Noosha Boi", "Apr 29, 2019", "04:55", "05:30",
    "new", "12:00", "null"],
  ['5', "Kiran Hospital", "Leena Boi", "Apr 30, 2019", "04:55", "05:30",
    "new", "12:00", "null"]
]

router.get('/', function (req, res, next) {
  renderView(res, {
    fullName: req.session.user.fName + ' ' + req.session.user.lName,
    user: req.session.user
  });
});

router.post('/filter/status', function (req, res, next) {
  const { appointmentid, stat } = req.body;
  for (appointment in appointments) {
    if (appointment == appointmentid) {
      appointments[appointment][6] = stat;
      break;
    }
  }
  res.send({
    appointments
  })
});


function renderView(res, config) {
  config.clinics = doctorClinics;
  config.appointments = appointments;
  res.render(`doctor/dashboard`, config);
}

module.exports = router;