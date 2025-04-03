const express = require("express");
const PetController = require("../controllers/pet.js");

const petsRouter = express.Router();

petsRouter.post("/", PetController.createPet);
petsRouter.get("/:id", PetController.getPetById);
petsRouter.delete("/:id", PetController.deletePetById);
petsRouter.put("/:id", PetController.updatePetById);

petsRouter.get("/user/:userId", PetController.getPetsByUserId);

module.exports = petsRouter;
