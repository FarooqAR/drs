var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/doctor', function(req, res, next) {
  res.render('doctor/signup', { type : 'doctor'});
});

module.exports = router;
