var router = require('../clinic');

router.get('/:id', function (req, res, next) {
  const id = req.params.id;
  const clinic = [
    id, // clinic_id 
    'Indus Hospital', // clinic_name,
    'Surgeon', // role
    34.23, // lat
    34.23, // long
    '3/2/12', // added_on
  ];

  res.render('doctor/clinic_details', {
    clinic,
    user: req.session.user
  });
});

module.exports = router;