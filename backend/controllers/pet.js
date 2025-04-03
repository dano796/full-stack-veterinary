const PetModel = require("../models/pet");
const { validatePet, validatePetUpdate } = require("../schemas/pets");

class PetController {
  static async createPet(req, res) {
    try {
      const validationResult = validatePet(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ errors: validationResult.errors });
      }

      const { user_id, name, species, breed, age, weight } =
        validationResult.data;

      const newPet = await PetModel.createPet(
        user_id,
        name,
        species,
        breed,
        age,
        weight
      );
      res.status(201).json(newPet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPetById(req, res) {
    try {
      const { id } = req.params;
      const pet = await PetModel.findById(id);

      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }

      res.status(200).json(pet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updatePetById(req, res) {
    try {
      const { id } = req.params;
      const validationResult = validatePetUpdate(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ errors: validationResult.errors });
      }

      const { user_id, name, species, breed, age, weight } =
        validationResult.data;

      const updatedPet = await PetModel.updateById(
        id,
        user_id,
        name,
        species,
        breed,
        age,
        weight
      );

      if (!updatedPet) {
        return res.status(404).json({ message: "Pet not found" });
      }

      res.status(200).json({ message: "Pet updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deletePetById(req, res) {
    try {
      const { id } = req.params;
      const deletedPet = await PetModel.deleteById(id);

      if (!deletedPet) {
        return res.status(404).json({ message: "Pet not found" });
      }

      res.status(200).json({ message: "Pet deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPetsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const pets = await PetModel.findByUserId(userId);
      res.status(200).json(pets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PetController;
