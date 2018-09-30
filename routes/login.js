/*
this module will handle all incoming GET/POST requests at http://localhost:3000/login
the "root" or "parent" route here is "/login", so the route names you see here as the first argument to
router.get are prepended by "/login" by default 
*/
var express = require('express');
var router = express.Router();

// GET handler for "/login"
router.get('/', function(req, res) {
  // Redirecting means sending the user to another route.
  // Here, we're currently redirecting from "/login" to "/login/user".  
  res.redirect('/login/user'); // this is not prepended by "/login"
})
// GET handler for "/login/user"
router.get('/user', function(req, res, next) {
  res.render('login', { type: 'user' });
});
// GET handler for "/login/doctor"
router.get('/doctor', function(req, res, next) {
  res.render('login', { type: 'doctor' });
});
module.exports = router;
