const bcrypt = require("bcryptjs");
const connection = require("../db/db.js");

const UserModel = {
  async findAll() {
    const conn = await connection;
    const [rows] = await conn.query("SELECT * FROM users");
    return rows;
  },

  async createUser(name, email, password, phone_number, address) {
    const conn = await connection;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await conn.query(
      "INSERT INTO users (name, email, password, phone_number, address) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, phone_number, address]
    );
    return { user_id: result.insertId, name, email, phone_number, address };
  },

  async findById(user_id) {
    const conn = await connection;
    const [rows] = await conn.query(
      "SELECT user_id, name, email, phone_number, address FROM users WHERE user_id = ?",
      [user_id]
    );
    return rows[0];
  },

  async updateById(user_id, name, email, password, phone_number, address) {
    const conn = await connection;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await conn.query(
      "UPDATE users SET name = ?, email = ?, password = ?, phone_number = ?, address = ? WHERE user_id = ?",
      [name, email, hashedPassword, phone_number, address, user_id]
    );
    return result.affectedRows > 0;
  },

  async deleteById(user_id) {
    const conn = await connection;
    const [result] = await conn.query("DELETE FROM users WHERE user_id = ?", [
      user_id,
    ]);
    return result.affectedRows > 0;
  },

  async findByEmail(email) {
    const conn = await connection;
    const [rows] = await conn.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },

  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  },
};

module.exports = UserModel;
