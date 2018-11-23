require('dotenv').config({ path: __dirname + '/.env' })
const db = require('./db');

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return init();
  })
  .then(() => process.exit())
  .catch(err => {
    console.error(err);
    process.exit();
  });
function init() {
  const Appointment = require('./db/models/Appointment');
  const ClinicTiming = require('./db/models/DoctorTiming');
  const DoctorClinic = require('./db/models/DoctorClinic');
  const DoctorQualification = require('./db/models/DoctorQualification');
  const Doctor = require('./db/models/Doctor');
  const User = require('./db/models/User');
  const College = require('./db/models/College');
  const Degree = require('./db/models/Degree');
  const Clinic = require('./db/models/Clinic');
  const Review = require('./db/models/Review');
  const Role = require('./db/models/Role');
  
  return Promise.all([
    ClinicTiming,
    DoctorClinic,
    DoctorQualification,
    Appointment,
    Doctor,
    User,
    College,
    Degree,
    Clinic,
    Review,
    Role,
  ].map(model => model.sync({ force: true })))
    .then(initializeConstraints)
}


function initializeConstraints() {
  return db.query(`
    ALTER TABLE Appointments
    ADD CONSTRAINT FK_AppointDoctorId 
    FOREIGN KEY (AppointDoctorId) REFERENCES Doctors(doctorId);
    
    ALTER TABLE Appointments
    ADD CONSTRAINT FK_AppointUserId 
    FOREIGN KEY (AppointUserId) REFERENCES Users(userId);
   
    ALTER TABLE Appointments
    ADD CONSTRAINT FK_AppointClinicId 
    FOREIGN KEY (AppointClinicId) REFERENCES Clinics(clinicId);
  
    ALTER TABLE Appointments
    ADD CONSTRAINT FK_AppointReviewId 
    FOREIGN KEY (AppointReviewId) REFERENCES Reviews(reviewId);
  
    ALTER TABLE DoctorClinics
    ADD CONSTRAINT FK_DoctorId 
    FOREIGN KEY (DoctorId) REFERENCES Doctors(doctorId);
  
    ALTER TABLE DoctorClinics
    ADD CONSTRAINT FK_ClinicId 
    FOREIGN KEY (ClinicId) REFERENCES Clinics(clinicId);
  
    ALTER TABLE DoctorClinics
    ADD CONSTRAINT FK_DoctorRoleId 
    FOREIGN KEY (DoctorRoleId) REFERENCES Roles(roleId);
  
    ALTER TABLE DoctorQualifications
    ADD CONSTRAINT FK_CollegeId 
    FOREIGN KEY (CollegeId) REFERENCES Colleges(collegeId);
  
    ALTER TABLE DoctorQualifications
    ADD CONSTRAINT FK_DegreeId 
    FOREIGN KEY (DegreeId) REFERENCES Degrees(degreeId);
  
    ALTER TABLE DoctorQualifications
    ADD CONSTRAINT FK_DoctorCollegeDegreeId 
    FOREIGN KEY (DoctorCollegeDegreeId) REFERENCES Doctors(doctorId);
  
    ALTER TABLE DoctorTimings
    ADD CONSTRAINT FK_ClinicDoctorId 
    FOREIGN KEY (ClinicDoctorId) REFERENCES DoctorClinics(doctorClinicId);
    `).then(dumpData);
}

function dumpData() {
  var fs = require('fs');
  var dump = JSON.parse(fs.readFileSync('./dump.json'));
  return Promise.all(
    [
      ...dump.users.map(function (user) {
        return db.query(
          `INSERT INTO Users(username, password, fName, lName) VALUES('${user.username}', '${user.password}', '${user.fName}', '${user.lName}')`
        );
      }),
      ...dump.doctors.map(function (doctor) {
        return db.query(
          `INSERT INTO Doctors(username, password, fName, lName) VALUES('${doctor.username}', '${doctor.password}', '${doctor.fName}', '${doctor.lName}')`
        );
      }),
      ...dump.clinics.map(function (clinic) {
        return db.query(
          `INSERT INTO Clinics(name, address, lat, long) VALUES('${clinic.name}', '${clinic.address}', ${clinic.lat}, ${clinic.long})`
        );
      }),
      ...dump.colleges.map(function (college) {
        return db.query(
          `INSERT INTO Colleges(name) VALUES('${college.name}')`
        );
      }),
      ...dump.degrees.map(function (degree) {
        return db.query(
          `INSERT INTO Degrees(name) VALUES('${degree.name}')`
        );
      }),
      ...dump.roles.map(function (role) {
        return db.query(
          `INSERT INTO Roles(name) VALUES('${role.name}')`
        );
      }),
      ...dump.doctorclinics.map(function (doctorclinic) {
        return db.query(
          `INSERT INTO doctorclinics(DoctorId, ClinicId, DoctorRoleId) VALUES(${doctorclinic.DoctorId}, ${doctorclinic.ClinicId}, ${doctorclinic.DoctorRoleId})`
        );
      }),
      ...dump.doctorqualifications.map(function (doctorqualification) {
        return db.query(
          `INSERT INTO doctorqualifications(CollegeId, DegreeId, DoctorCollegeDegreeId, year) VALUES(${doctorqualification.CollegeId}, ${doctorqualification.DegreeId}, ${doctorqualification.DoctorCollegeDegreeId}, ${doctorqualification.year})`
        );
      }),
      ...dump.doctortimings.map(function (doctortiming) {
        return db.query(
          `INSERT INTO doctortimings(day, [to], [from], ClinicDoctorId) VALUES('${doctortiming.day}', '${doctortiming.to}', '${doctortiming.from}', ${doctortiming.ClinicDoctorId})`
        );
      }),
    ])
}