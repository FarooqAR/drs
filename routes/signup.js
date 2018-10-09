var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/doctor', function(req, res, next) {
  res.render('doctor/signup', { type : 'doctor'});
});

router.get('/user', function(req, res, next) {
    res.render('user/signup', { type: 'user' });
});

module.exports = router;
