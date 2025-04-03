const connection = require("../db/db.js");

const PaymentModel = {
  async createPayment(user_id, amount, status = "completed") {
    const conn = await connection;
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    const [result] = await conn.query(
      "INSERT INTO payments (user_id, date, amount, status) VALUES (?, ?, ?, ?)",
      [user_id, date, amount, status]
    );
    return { payment_id: result.insertId, user_id, date, amount, status };
  },

  async findById(payment_id) {
    const conn = await connection;
    const [rows] = await conn.query(
      "SELECT * FROM payments WHERE payment_id = ?",
      [payment_id]
    );
    return rows[0];
  },
};

module.exports = PaymentModel;
