const connection = require("../db/db.js");

const ExamModel = {
  async createExam(pet_id, exam_type, date, result, status, payment_method) {
    const conn = await connection;
    const [resultQuery] = await conn.query(
      "INSERT INTO exams (pet_id, exam_type, date, result, status, payment_method) VALUES (?, ?, ?, ?, ?, ?)",
      [pet_id, exam_type, date, result, status, payment_method]
    );
    return {
      exam_id: resultQuery.insertId,
      pet_id,
      exam_type,
      date,
      result,
      status,
      payment_method,
    };
  },

  async findById(exam_id) {
    const conn = await connection;
    const [rows] = await conn.query("SELECT * FROM exams WHERE exam_id = ?", [
      exam_id,
    ]);
    return rows[0];
  },

  async deleteById(exam_id) {
    const conn = await connection;
    const [result] = await conn.query("DELETE FROM exams WHERE exam_id = ?", [
      exam_id,
    ]);
    return result.affectedRows > 0;
  },

  async findByUserId(user_id) {
    const conn = await connection;
    const [rows] = await conn.query(
      "SELECT e.*, p.name as pet_name FROM exams e " +
        "LEFT JOIN pets p ON e.pet_id = p.pet_id " +
        "WHERE e.pet_id IN (SELECT pet_id FROM pets WHERE user_id = ?)",
      [user_id]
    );
    return rows;
  },
};

module.exports = ExamModel;
