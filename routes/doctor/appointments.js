const express = require('express');
const appointGetHandler = require('../appointments');
const appointmentDbService = require('../../db/services/appointment');
const router = express.Router();

router.get('/:appointmentId', appointGetHandler);

router.post('/:appointmentId/change_status', async function (req, res, next) {
  const { appointmentId } = req.params;
  const { status } = req.body;
  try {
    var success = (await appointmentDbService.changeStatus(appointmentId, req.session.user.id, status))[1];
    if (success) {
      res.send({});
    }
    else {
      throw new Error('Could not change status')
    }
  } catch (error) {
    res.send(error);
  }

})

module.exports = router;