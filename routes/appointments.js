const appointDbService = require('../db/services/appointment');
const utils = require('../util');

const appointGetHandler = async function (req, res, next) {
  const { appointmentId } = req.params;
  try {
    var appointment = (await appointDbService.get(appointmentId, req.session.user))[0];

    if (appointment == undefined) {
      return next(new Error('Not Found'));
    }
    var createdAt = new Date(appointment.createdAt);
    var to = new Date(appointment.to);
    var from = new Date(appointment.from);
    createdAt.setHours(createdAt.getHours() - 5);
    to.setHours(to.getHours() - 5);
    from.setHours(from.getHours() - 5);
    appointment.createdAt = utils.formatAMPM(createdAt) + ' ' + createdAt.toDateString();
    appointment.from = utils.formatAMPM(from);
    appointment.to = utils.formatAMPM(to);
    appointment.date = from.toDateString();
    appointment.isPast = to.getTime() < Date.now() || appointment.status == 'done' || appointment.status == 'rejected' ;
    appointment.appointmentId = appointmentId;
    res.render(`${req.session.user.type}/appoint_details`, {
      appointment,
      user: req.session.user
    })
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = appointGetHandler;