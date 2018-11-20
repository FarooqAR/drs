require('dotenv').config({ path: __dirname + '/.env' })
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const uuid = require('uuid/v4');
const LokiStore = require('connect-loki')(session);
const path = require('path');
const db = require('./db');

// const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const doctorSettingsRouter = require('./routes/doctor/settings');
const userSettingsRouter = require('./routes/user/settings');
const doctorDashboardRouter = require('./routes/doctor/dashboard');
const userDashboardRouter = require('./routes/user/dashboard');
const doctorAppointmentsRouter = require('./routes/doctor/appointments');
const clinicsRouter = require('./routes/doctor/clinics');
const doctorHistoryRouter = require('./routes/doctor/history');

const app = express();

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
  store: new LokiStore(),
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
})

app.use(express.json()); // parser for JSON data

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRouter);
app.use('/signup', signupRouter);

app.use(function (req, res, next) {
  if (req.session.user)
    return next();

  res.redirect('/login/user');
});

app.use('/', function (req, res, next) {
  if (req.session.user && req.session.user.type == 'doctor')
    return doctorDashboardRouter(req, res, next)
  userDashboardRouter(req, res, next);
});

app.use('/logout', function (req, res) {
  const userType = req.session.user ? req.session.user.type : '';
  req.session.destroy();
  res.redirect('/login/' + userType);
});


app.use('/settings', function (req, res, next) {
  if (req.session.user && req.session.user.type == 'doctor')
    return doctorSettingsRouter(req, res, next)
  userSettingsRouter(req, res, next);
});

app.use('/appointments', doctorAppointmentsRouter);

app.use('/clinics', clinicsRouter);
app.use('/history', function (req, res, next) {
  if (req.session.user && req.session.user.type == 'doctor')
    return doctorHistoryRouter(req, res, next)
  next()
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// // error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('common/error', {user: req.session && req.session.user});
});

module.exports = app;
