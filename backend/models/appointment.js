const connection = require("../db/db.js");

const AppointmentModel = {
  async createAppointment(user_id, pet_id, date, status, payment_method) {
    const conn = await connection;
    const [result] = await conn.query(
      "INSERT INTO appointments (user_id, pet_id, date, status, payment_method) VALUES (?, ?, ?, ?, ?)",
      [user_id, pet_id, date, status, payment_method]
    );
    return {
      appointment_id: result.insertId,
      user_id,
      pet_id,
      date,
      status,
      payment_method,
    };
  },

  async findById(appointment_id) {
    const conn = await connection;
    const [rows] = await conn.query(
      "SELECT a.*, p.name as pet_name FROM appointments a " +
        "LEFT JOIN pets p ON a.pet_id = p.pet_id " +
        "WHERE a.appointment_id = ?",
      [appointment_id]
    );
    return rows[0];
  },

  async deleteById(appointment_id) {
    const conn = await connection;
    const [result] = await conn.query(
      "DELETE FROM appointments WHERE appointment_id = ?",
      [appointment_id]
    );
    return result.affectedRows > 0;
  },

  async findByUserId(user_id) {
    const conn = await connection;
    const [rows] = await conn.query(
      "SELECT a.*, p.name as pet_name FROM appointments a " +
        "LEFT JOIN pets p ON a.pet_id = p.pet_id " +
        "WHERE a.pet_id IN (SELECT pet_id FROM pets WHERE user_id = ?)",
      [user_id]
    );
    return rows;
  },
};

module.exports = AppointmentModel;
