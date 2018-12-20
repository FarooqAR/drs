const express = require('express');
const router = express.Router();
const userDbService = require('../db/services/user');
const doctorDbService = require('../db/services/doctor');
const errors = require('../db/errors');
const util = require('../util');

/* GET home page. */
router.get('/doctor', function (req, res, next) {
  if (req.session.user)
    return res.redirect('/');
  res.render('doctor/signup', { type: 'doctor' });
});

router.get('/user', function (req, res, next) {
  if (req.session.user)
    return res.redirect('/');
  res.render('user/signup', { type: 'user' });
});

router.post('/user', function (req, res, next) {
  const { fname, lname, username, password, cpassword } = req.body;//create user ke liey info li
  if (fname && lname && username && password && cpassword) { // if valid 
    if (password != cpassword) { //if password diff tou wapis sign up kholdo
      return res.render('user/signup', { type: 'user', error: 'Password didnt match', fname, lname, username });
    }//if password is create
    userDbService.createUserWithoutLocation({
      ...req.body,//yaha nper user name password form submit karne se araha hai
      fname: util.capitalize(fname), 
      lname: util.capitalize(lname)
      //yahan user create horaha hai
    })

    //agar hogaya tou yahan
    .then(function (result) {
      //session hai jo agar koi cheex loginhogayi tou jab tak browser khula hai yeh open rehega, session mein yeh information saved hai
      //browser bandd karne per yeh sab delete agar session expire hogaya ho
      req.session.user = { id: result[0][0].userId, type: 'user', fName: result[0][0].fName, lName: result[0][0].lName };
      return res.redirect('/settings');
    })
    //warna yahan
    .catch(function (err) {
      let msg = 'Couldn\'t sign up. An unknown error occurred';
      if (err.name == errors.UNIQUE_CONSTRAINT_ERROR )
        msg = 'Username already exists';
      res.render('user/signup', { type: 'user', error: msg, fname, lname });
    })
  }
  else {
    res.render('user/signup', { type: 'user', error: 'One or more fields missing', fname, lname, username });
  }
});

router.post('/doctor', function (req, res, next) {
  const { fname, lname, username, password, cpassword } = req.body;
  if (fname && lname && username && password && cpassword) {
    if (password != cpassword) {
      return res.render('doctor/signup', { type: 'doctor', error: 'Password didnt match',  fname, lname, username });
    }
    doctorDbService.createDoctor({
      ...req.body,
      fname: util.capitalize(fname), 
      lname: util.capitalize(lname)
    })
    .then(function (result) {
      req.session.user = { id: result[0][0].doctorId, type: 'doctor', fName: result[0][0].fName, lName: result[0][0].lName };
      return res.redirect('/settings?new=true');
    })
    .catch(function (err) {
      let msg = 'Couldn\'t sign up. An unknown error occurred';
      if (err.name == errors.UNIQUE_CONSTRAINT_ERROR )
        msg = 'Username already exists';
      res.render('doctor/signup', { type: 'doctor', error: msg, fname, lname });
    })
  }
  else {
    res.render('doctor/signup', { type: 'doctor', error: 'One or more fields missing', fname, lname, username });
  }
});

module.exports = router;
