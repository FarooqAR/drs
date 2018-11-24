const express = require('express');
const router = express.Router();
const userDbService = require('../../db/services/user');

router.get('/', function (req, res, next) {
  console.log(req.session.user);
  res.render('user/settings', { user: req.session.user });
});

router.post('/location', function (req, res, next) {
  const { lat, long } = req.body;
  const userId = req.session.user.id;
  var data = { lat, long, userId };
  userDbService.updateUserWithLocation(data)
    .then(function (result) {
      res.send(result)
    })
    .catch(function (err) {
      let error = 'Couldn\'t add location. An unknown error occurred';
      res.send({ error });
    })
});



module.exports = router;