const express = require('express');
const router = express.Router();
const userDbService = require('../db/services/user');
const doctorDbService = require('../db/services/doctor');
const errors = require('../db/errors');
const util = require('../util');

/* GET home page. */
router.get('/doctor', function (req, res, next) {
  res.render('doctor/signup', { type: 'doctor' });
});

router.get('/user', function (req, res, next) {
  res.render('user/signup', { type: 'user' });
});

router.post('/user', function (req, res, next) {
  const { fname, lname, username, password, cpassword } = req.body;
  if (fname && lname && username && password && cpassword) {
    if (password != cpassword) {
      return res.render('user/signup', { type: 'user', error: 'Password didnt match' });
    }
    userDbService.createUserWithoutLocation({
      ...req.body,
      fname: util.capitalize(fname), 
      lname: util.capitalize(lname)
    })
    .then(function (result) {
      req.session.user = { id: result[0][0].userId, type: 'user', fName: result[0][0].fName, lName: result[0][0].lName };
      return res.redirect('/');
    })
    .catch(function (err) {
      let msg = 'Couldn\'t sign up. An unknown error occurred';
      if (err.name == errors.UNIQUE_CONSTRAINT_ERROR )
        msg = 'Username already exists';
      res.render('user/signup', { type: 'user', error: msg, fname, lname });
    })
  }
  else {
    res.render('user/signup', { type: 'user', error: 'One or more fields missing' });
  }
});

router.post('/doctor', function (req, res, next) {
  const { fname, lname, username, password, cpassword } = req.body;
  if (fname && lname && username && password && cpassword) {
    if (password != cpassword) {
      return res.render('doctor/signup', { type: 'doctor', error: 'Password didnt match' });
    }
    doctorDbService.createDoctor({
      ...req.body,
      fname: util.capitalize(fname), 
      lname: util.capitalize(lname)
    })
    .then(function (result) {
      req.session.user = { id: result[0][0].doctorId, type: 'doctor', fName: result[0][0].fName, lName: result[0][0].lName };
      return res.redirect('/');
    })
    .catch(function (err) {
      let msg = 'Couldn\'t sign up. An unknown error occurred';
      if (err.name == errors.UNIQUE_CONSTRAINT_ERROR )
        msg = 'Username already exists';
      res.render('doctor/signup', { type: 'doctor', error: msg, fname, lname });
    })
  }
  else {
    res.render('doctor/signup', { type: 'doctor', error: 'One or more fields missing' });
  }
});

module.exports = router;
