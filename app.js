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
const qualRouter = require('./routes/qualification');
const roleRouter = require('./routes/roles');
const timingsRouter = require('./routes/timing');
const affiliationRouter = require('./routes/affiliation');
const doctorSettingsRouter = require('./routes/doctor/settings');
const doctorDashboardRouter = require('./routes/doctor/dashboard');
const doctorAppointmentsRouter = require('./routes/doctor/appointments');
const clinicsForDoctorsRouter = require('./routes/doctor/clinics');
const doctorHistoryRouter = require('./routes/doctor/history');
const userDashboardRouter = require('./routes/user/dashboard');
const doctorsForUsersRouter = require('./routes/user/doctors');
const clinicsForUsersRouter = require('./routes/user/clinics');
const userSettingsRouter = require('./routes/user/settings');
const userHistoryRouter = require('./routes/user/history');
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
    //agar logged in hai tou agey wale route access karega
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

app.use('/clinics', function (req, res, next) {
  if (req.session.user && req.session.user.type == 'doctor')
    return clinicsForDoctorsRouter(req, res, next)
  clinicsForUsersRouter(req, res, next);
});
app.use('/doctors', function (req, res, next) {
  if (req.session.user && req.session.user.type == 'user')
    return doctorsForUsersRouter(req, res, next)
  next()
});
app.use('/history', function (req, res, next) {
  if (req.session.user && req.session.user.type == 'doctor')
    return doctorHistoryRouter(req, res, next)
  userHistoryRouter(req, res, next);
});

app.use('/qualification', qualRouter);
app.use('/roles', roleRouter);
app.use('/timings', timingsRouter);
app.use('/affiliations', affiliationRouter);
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
  res.render('common/error', { user: req.session && req.session.user });
});

module.exports = app;
