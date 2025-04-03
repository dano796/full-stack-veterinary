const AppointmentModel = require("../models/appointment");
const { validateAppointment } = require("../schemas/appointments");

class AppointmentController {
  static async createAppointment(req, res) {
    try {
      const validationResult = validateAppointment(req.body);
      if (!validationResult.success)
        return res.status(400).json({ errors: validationResult.errors });

      const { user_id, pet_id, date, status, payment_method } =
        validationResult.data;
      const newAppointment = await AppointmentModel.createAppointment(
        user_id,
        pet_id,
        date,
        status,
        payment_method
      );
      res.status(201).json(newAppointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAppointmentById(req, res) {
    try {
      const appointment = await AppointmentModel.findById(req.params.id);
      if (!appointment)
        return res.status(404).json({ message: "Appointment not found" });
      res.status(200).json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteAppointmentById(req, res) {
    try {
      const deleted = await AppointmentModel.deleteById(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: "Appointment not found" });
      res.status(200).json({ message: "Appointment deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAppointmentsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const appointments = await AppointmentModel.findByUserId(userId);
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AppointmentController;
