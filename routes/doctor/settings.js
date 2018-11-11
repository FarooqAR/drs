// this module will handle settings for doctor

const express = require('express');
const router = express.Router();
// dummy roles 
const roles = [
  'General Physician',
  'Surgeon',
  'Dentist',
  'Eye Specialist'
];
// dummy colleges 
const colleges = [
  ['0', 'King Edward Medical College'],
  ['1', 'Nishtar Medical College'],
  ['2', 'Fatima Jinnah Medical College'],
  ['3', 'Army Medical College'],
  ['4', 'Allama Iqbal Medical College'],
  ['5', 'Punjab Medical College'],
  ['6', 'Quaid-e-Azam Medical College'],
  ['7', 'Rawalpindi Medical College'],
  ['8', 'Sargodha Medical College'],
  ['9', 'Shaikh Zayed Medical College'],
  ['10', 'Nawaz Sharif Medical College'],
  ['11', 'Federal Medical & Dental College'],
  ['12', 'Gujranwala Medical College'],
  ['13', 'D.G. Khan Medical College'],
  ['14', 'Lahore Medical & Dental College'],
  ['15', 'Shifa College of Medicine'],
  ['16', 'Liaquat National Medical College']
];
// dummy degrees
const degrees = [
  ['0', 'Anaesthesiology'],
  ['1', 'Audiology'],
  ['2', 'Cardiovascular Sciences'],
  ['3', 'Clinical Micro Biology'],
  ['4', 'Dental Hygienist'],
  ['5', 'Dentistry'],
  ['6', 'Diagnostic Radiology'],
  ['7', 'Dermatology'],
  ['8', 'Food Sciences & Human Nutrition'],
  ['9', 'Forensic Studies'],
  ['10', 'Ophthalmology'],
  ['11', 'General Nursing'],
  ['12', 'Molecular Pathology'],
  ['13', 'Neuro Sciences'],
  ['14', 'Occupational Therapy'],
  ['15', 'Orthopedics'],
] 
// dummy qualifications  
const qualifications = [
  // [id, college, degree, year],
  ["0", "HabibUni", "CS", "1998"],
  ["1", "AghaKhan", "MBBS", "2011"]
];
// dummy clinics...
const allClinics = [
  // [id, name],
  ["0", "Indus Hospital"],
  ["1", "Civil Hospital"],
  ["2", "Ziauddin Hospital"],
  ["3", "Abbasi Shaheed Hospital"],
  ["4", "Sindh Institute of Urology and Transplantation"],
  ["5", "Ibn-e-Sina Medical Center"],
  ["6", "Ibrahim Eye Hospital"],
  ["7", "Imam Clinic"],
];
// doctor's clinics (will be in db for each doctor)
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

router.get('/', function (req, res, next) {
  renderView(res, {
    fullName: 'Farooq AR',
    firstTimer: true,
    qualifications, // qualifications coming from database; dummy for now   
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
      qualifications.splice(i, 1); // removes one element at i
      break;
    }
  }
  res.send({
    qualifications
  });
});

router.post('/add/clinic', function (req, res, next) {
  const clinic = req.body;
  clinic.unshift(doctorClinics.length);
  doctorClinics.push(clinic);
  // we can also send objects (json) 
  res.send({
    clinics: doctorClinics
  })
});

router.post('/delete/clinic', function (req, res, next) {
  const clinicId = req.body.id;
  for (let i = 0, l = doctorClinics.length; i < l; i++) {
    const clinic = doctorClinics[i];
    if (clinic[0] == clinicId) { // found the desired clinic
      doctorClinics.splice(i, 1); // removes one clinic at i
      break;
    }
  }
  res.send({
    clinics: doctorClinics
  })
});

router.post('/delete/clinic_timing', function (req, res, next) {
  const { clinicId, timingId } = req.body;
  outer: 
  for (let i = 0, l = doctorClinics.length; i < l; i++) {
    const clinic = doctorClinics[i];
    const timings = clinic[3];

    if (clinic[0] == clinicId) { // found the desired clinic

      for (let j = 0, k = timings.length; j < k; j++) {

        if (timings[j][0] == timingId) { // found the desired timing
          
          timings.splice(j, 1);
          // remove the whole clinic if it has no timings
          if(timings.length == 0) { 
            doctorClinics.splice(i, 1);
          }
          break outer;
        }
      }
    }
  }
  res.send({
    clinics: doctorClinics
  })
});

function renderView(res, config) {
  config.roles = roles;
  config.all_clinics = allClinics;
  config.clinics = doctorClinics;
  config.colleges = colleges;
  config.degrees = degrees; 
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