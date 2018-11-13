/*
this module will handle all incoming GET/POST requests at http://localhost:3000/login
the "root" or "parent" route here is "/login", so the route names you see here as the first argument to
router.get are prepended by "/login" by default 
*/
const express = require('express');
const router = express.Router();
const doctorDbService = require('../db/services/doctor');
const userDbService = require('../db/services/user');
// GET handler for "/login"
// GET handler for "/login/user"
router.get('/', function (req, res) {
  // Redirecting means sending the user to another route.
  if (req.session.user)
    return res.redirect('/');
  res.redirect('/login/user'); // this is not prepended by "/login"
})
router.get('/user', function (req, res, next) {
  if (req.session.user)
    return res.redirect('/');
  res.render('login', { type: 'user' });
});
// GET handler for "/login/doctor"
router.get('/doctor', function (req, res, next) {
  if (req.session.user)
    return res.redirect('/');
  res.render('login', { type: 'doctor' });
});

router.post('/doctor', function (req, res, next) {
  const { id: username, password } = req.body;
  // prevents form resubmission
  if (req.session.user && req.session.user.username == username && req.session.user.password == password) {
    return res.redirect('/doctor');
  }
  
  doctorDbService.getMatchingDoctor(username, password).then(result => {
   if (result.length == 1) {
     req.session.user = { id: result[0].doctorId, type: 'doctor', fName: result[0].fName, lName: result[0].lName };
     return res.redirect('/');
   }
   res.render('login', { type: 'doctor', error: 'Invalid Credentials' });
  })
  .catch(e => res.render('login', { type: 'doctor', error: 'Some Error Occurred' }));
});

router.post('/user', function (req, res, next) {
  const { id: username, password } = req.body;
  // prevents form resubmission
  if (req.session.user && req.session.user.id == id && req.session.user.password == password) {
    return res.redirect('/user');
  }
  userDbService.getMatchingUser(username, password).then(result => {
    if (result.length == 1) {
      req.session.user = { id: result[0].userId, type: 'user', fName: result[0].fName, lName: result[0].lName };
      return res.redirect('/');
    }
    res.render('login', { type: 'user', error: 'Invalid Credentials' });
   })
   .catch(e => res.render('login', { type: 'user', error: 'Some Error Occurred' }));

});

module.exports = router;
