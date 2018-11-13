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
    "done", "01:00", '1'],
    ['2', "Indus Hospital", "Faizan Boi", 'Apr 27, 2019', "04:55", "05:30", 
        "done", "12:00", "10"],
    ['3', "AKUH", "Kainat Boi", "Apr 28, 2019", "04:55", "05:30", 
    "done", "12:00", "9"],
    ['4', "Parklane", "Noosha Boi", "Apr 29, 2019", "04:55", "05:30", 
    "done", "12:00", "7"],
    ['5', "Kiran Hospital", "Leena Boi", "Apr 30, 2019", "04:55", "05:30", 
    "done", "12:00", "8"],
    ['6', "Kiran Hospital", "Sameer Boi", "Oct 25, 2018", "04:55", "05:30", 
    "done", "12:00", "8"]
  ]

  router.get('/', function (req, res, next) {
    renderView(res, {
      fullName: 'Farooq AR'
    });
  });

  router.post('/', function (req, res, next) {
    res.send(appointments);
  });

router.post('/filter/status', function (req, res, next) {
  const { appointmentid, stat } = req.body;
  for (appointment in appointments)
  {
    if (appointment == appointmentid)
    {
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
    config.appointments = [];
    res.render('doctor/history', config);
}

module.exports = router;