const z = require("zod");

const petSchema = z.object({
  user_id: z.number().int().positive("User ID must be a positive integer"),
  name: z.string().min(1, "Name is required").max(60, "Name is too long"),
  species: z
    .string()
    .min(1, "Species is required")
    .max(60, "Species is too long"),
  breed: z.string().min(1, "Breed is required").max(60, "Breed is too long"),
  age: z.number().int().nonnegative("Age cannot be negative").optional(),
  weight: z.number().nonnegative("Weight cannot be negative").optional(),
});

function validatePet(pet) {
  const result = petSchema.safeParse(pet);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((e) => e.message),
    };
  }
  return { success: true, data: result.data };
}

function validatePetUpdate(pet) {
  const petUpdateSchema = petSchema.partial();
  const result = petUpdateSchema.safeParse(pet);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((e) => e.message),
    };
  }
  return { success: true, data: result.data };
}

module.exports = { validatePet, validatePetUpdate };
