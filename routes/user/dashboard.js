var express = require('express');
var router = express.Router();

function renderView(res, config) {
  res.render(`user/dashboard`, config);
}

router.get('/', function (req, res, next) {
  renderView(res, {
    fullName: 'Patient',
    user: req.session.user
  });
});

module.exports = router;