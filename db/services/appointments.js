const Sequelize = require('sequelize');
const db = require('../');
const Appointment = require('../models/Appointment');

//+ - all appointments for user

function getAllAppointments(id){
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE [status] = 'Done'
        AND Doctors.doctorId = Appointments.AppointDoctorId
        AND Appointments.AppointUserId = ${id}
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId`, {type : Sequelize.QueryTypes.SELECT}
    );
}


//+ - username AND clinic

function getAppointsByClinic(clinic, userid){
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE Users.userId=${userid} 
        AND Clinics.name LIKE '%${clinic}%'
        AND [status] = 'Done' 
        AND Doctors.doctorId = Appointments.AppointDoctorId
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId`,{type : Sequelize.QueryTypes.SELECT}
    );
}

//+ - username AND doctorname

function getAppointsByDoctorname(doctorname, userid) {
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE (Doctors.fName+' '+Doctors.lName) LIKE '%${doctorname}%' 
        AND [status] = 'Done' 
        AND Users.userId=${userid}
        AND Doctors.doctorId = Appointments.AppointDoctorId
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId`,{type : Sequelize.QueryTypes.SELECT}
    );
}

//+ - username AND daterange

function getAppointmentsByDate(fromdate, todate, userid){
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE [from] >= '${fromdate}' AND [from] <= '${todate}'
        AND [status] = 'Done' 
        AND Users.userId=${userid} 
        AND Doctors.doctorId = Appointments.AppointDoctorId
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId
        `, {type : Sequelize.QueryTypes.SELECT}
    );
}

//+ - username AND clinic AND doctorname

function getAppointsByDoctornameAndClinic(doctorname, clinic,userid){
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE (Doctors.fName+' '+Doctors.lName) LIKE '%${doctorname}%' 
        AND Clinics.name LIKE '%${clinic}%'
        AND [status] = 'Done' 
        AND Users.userId=${userid}
        AND Doctors.doctorId = Appointments.AppointDoctorId
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId`, {type : Sequelize.QueryTypes.SELECT}
    );
}

//+ - username AND clinic AND daterange

function getAppointmentsByDateAndClinic(fromdate, todate, clinic, userid){
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE [from] >= '${fromdate}' AND [from] <= '${todate}'
        AND Clinics.name LIKE '%${clinic}'
        AND [status] = 'Done' 
        AND Users.userId=${userid}
        AND Doctors.doctorId = Appointments.AppointDoctorId
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId
        `, {type : Sequelize.QueryTypes.SELECT}
    );
}

//+ - username AND doctorname AND daterange

function getAppointmentsByDateAndDoctor(fromdate, todate, doctorname, userid){
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE [from] >= '${fromdate}' AND [from] <= '${todate}'
        AND (Doctors.fName+' '+Doctors.lName) LIKE '%${doctorname}%' 
        AND [status] = 'Done' 
        AND Users.userId=${userid}
        AND Doctors.doctorId = Appointments.AppointDoctorId
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId
        `, {type : Sequelize.QueryTypes.SELECT}
    );
}

//+ - username AND clinic AND doctorname AND daterange

function getAppointmentsByDateAndDoctorAndClinic(fromdate, todate, doctor, clinic, userid){
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE [from] >= '${fromdate}' AND [from] <= '${todate}'
        AND (Doctors.fName+' '+Doctors.lName) LIKE '%${doctor}%'
        AND Clinics.name LIKE '%${clinic}'
        AND Users.userId=${userid}
        AND [status] = 'Done' 
        AND Doctors.doctorId = Appointments.AppointDoctorId
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId
        `, {type : Sequelize.QueryTypes.SELECT}
    );
}

//+ - all appointments for doctor

function getAllAppointmentsD(id){
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE [status] = 'Done'
        AND Users.userId = Appointments.AppointUserId
        AND Appointments.AppointDoctorId = ${id}
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId`, {type : Sequelize.QueryTypes.SELECT}
    );
}

//+ - doctorname AND clinic

function getAppointsByClinicD(clinic, doctorId){
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE Doctors.doctorId=${doctorId} 
        AND Clinics.name LIKE '%${clinic}%'
        AND [status] = 'Done' 
        AND Users.userId = Appointments.AppointUserId
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId`,{type : Sequelize.QueryTypes.SELECT}
    );
}

//+ - doctorname AND username 

function getAppointsByUsername(username, userId) {
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE (Users.fName+' '+Users.lName) LIKE '%${username}%' 
        AND [status] = 'Done' 
        AND Doctors.doctorId=${userId}
        AND Users.userId = Appointments.AppointUserId
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId`,{type : Sequelize.QueryTypes.SELECT}
    );
}

//+ - doctorname AND daterange

function getAppointmentsByDateD(fromdate, todate, userId){
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE [from] >= '${fromdate}' AND [from] <= '${todate}'
        AND [status] = 'Done' 
        AND Doctors.doctorId=${userId}
        AND Users.userId = Appointments.AppointUserId
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId
        `,{type : Sequelize.QueryTypes.SELECT}
    );
}

//+ - doctorname AND clinic AND username

function getAppointsByUsernameAndClinic(doctorname, clinic,userId){
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE (Users.fName+' '+Users.lName) LIKE '%${doctorname}%' 
        AND Clinics.name LIKE '%${clinic}%'
        AND [status] = 'Done' 
        AND Doctors.doctorId=${userId}
        AND Users.userId = Appointments.AppointUserId
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId`, {type : Sequelize.QueryTypes.SELECT}
    );
}

//+ - doctorname AND clinic AND daterange

function getAppointmentsByDateAndClinicD(fromdate, todate, clinic, userId){
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE [from] >= '${fromdate}' AND [from] <= '${todate}'
        AND Clinics.name LIKE '%${clinic}'
        AND [status] = 'Done' 
        AND Doctors.doctorId=${userId}
        AND Users.userId = Appointments.AppointUserId
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId
        `,{type : Sequelize.QueryTypes.SELECT}
    );
}

//+ - doctorname AND username AND daterange


function getAppointmentsByDateAndUser(fromdate, todate, doctorname, userId){
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE [from] >= '${fromdate}' AND [from] <= '${todate}'
        WHERE (Users.fName+' '+Users.lName) LIKE '%${doctorname}%' 
        AND [status] = 'Done' 
        AND Doctors.doctorId=${userId}
        AND Users.userId = Appointments.AppointUserId
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId
        `,{type : Sequelize.QueryTypes.SELECT}
    );
}


//+ - doctorname AND clinic AND username AND daterange

function getAppointmentsByDateAndUserAndClinic(fromdate, todate, doctor, clinic, userId){
    return db.query(
        `SELECT appointmentId as id, Clinics.name as clinic,(Users.fName+' '+Users.lName) as userfullname,
        (Doctors.fName+' '+Doctors.lName) as docfullname,[from],[to], Reviews.rating as rating
        FROM Appointments, Doctors, Clinics, Users, Reviews
        WHERE [from] >= '${fromdate}' AND [from] <= '${todate}'
        AND (Users.fName+' '+Users.lName) LIKE '%${doctor}%'
        AND Clinics.name LIKE '%${clinic}'
        AND [status] = 'Done' 
        AND Doctors.doctorId=${userId}
        AND Users.userId = Appointments.AppointUserId
        AND Clinics.clinicId = AppointClinicId
        AND userId = AppointUserId
        AND doctorId = AppointDoctorId
        AND reviewId = AppointReviewId
        `,{type : Sequelize.QueryTypes.SELECT}
    );
}


module.exports = {
    getAllAppointments,
    getAppointsByDoctorname,
    getAppointsByClinic,
    getAppointmentsByDate,
    getAppointsByDoctornameAndClinic,
    getAppointmentsByDateAndClinic,
    getAppointmentsByDateAndDoctor,
    getAppointmentsByDateAndDoctorAndClinic,
    getAllAppointmentsD,
    getAppointsByClinicD,
    getAppointsByUsername,    
    getAppointmentsByDateD,
    getAppointsByUsernameAndClinic,
    getAppointmentsByDateAndClinicD,
    getAppointmentsByDateAndUser,
    getAppointmentsByDateAndUserAndClinic
        
    //getAppointsByUsername,
    
  };