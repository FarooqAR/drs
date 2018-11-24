const express = require('express');
const router = express.Router();
const userDbService = require('../../db/services/user');

router.get('/', function (req, res, next) {
  console.log(req.session.user);
  res.render('user/settings', { user: req.session.user });
});

router.post('/location', function (req, res, next) {
  console.log("in post");
  const { x, y } = req.body;
  username = req.session.user.id;
  var data = {x, y, username};
  console.log(data);

  userDbService.updateUserWithLocation({
    ...data
  })
  .then(function (result) {
    req.session.user = { id: username, type: 'user', lat: x, long: y};
    return res.redirect('/user/dashboard');
  })
  .catch(function (err) {
    fname = req.session.user.fName;
    lname = req.session.user.lName;
    let msg = 'Couldn\'t add location. An unknown error occurred';
    res.render('user/settings', { type: 'user', error: msg, fname, lname });
    })
  res.redirect( '/' );
});



module.exports = router;