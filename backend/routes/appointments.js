const express = require("express");
const AppointmentController = require("../controllers/appointment.js");

const appointmentsRouter = express.Router();

appointmentsRouter.post("/", AppointmentController.createAppointment);
appointmentsRouter.get("/:id", AppointmentController.getAppointmentById);
appointmentsRouter.delete("/:id", AppointmentController.deleteAppointmentById);

appointmentsRouter.get(
  "/user/:userId",
  AppointmentController.getAppointmentsByUserId
);

module.exports = appointmentsRouter;
