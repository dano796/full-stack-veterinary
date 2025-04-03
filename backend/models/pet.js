const connection = require("../db/db.js");

const PetModel = {
  async createPet(user_id, name, species, breed, age, weight) {
    const conn = await connection;
    const [result] = await conn.query(
      "INSERT INTO pets (user_id, name, species, breed, age, weight) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, name, species, breed, age, weight]
    );
    return {
      pet_id: result.insertId,
      user_id,
      name,
      species,
      breed,
      age,
      weight,
    };
  },

  async findById(pet_id) {
    const conn = await connection;
    const [rows] = await conn.query("SELECT * FROM pets WHERE pet_id = ?", [
      pet_id,
    ]);
    return rows[0];
  },

  async findByUserId(user_id) {
    const conn = await connection;
    const [rows] = await conn.query("SELECT * FROM pets WHERE user_id = ?", [
      user_id,
    ]);
    return rows;
  },

  async updateById(pet_id, user_id, name, species, breed, age, weight) {
    const conn = await connection;
    const [result] = await conn.query(
      "UPDATE pets SET user_id = ?, name = ?, species = ?, breed = ?, age = ?, weight = ? WHERE pet_id = ?",
      [user_id, name, species, breed, age, weight, pet_id]
    );
    return result.affectedRows > 0;
  },

  async deleteById(pet_id) {
    const conn = await connection;
    const [result] = await conn.query("DELETE FROM pets WHERE pet_id = ?", [
      pet_id,
    ]);
    return result.affectedRows > 0;
  },

  async findByUserId(user_id) {
    const conn = await connection;
    const [rows] = await conn.query("SELECT * FROM pets WHERE user_id = ?", [
      user_id,
    ]);
    return rows;
  },
};

module.exports = PetModel;
