const z = require("zod");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z
    .string()
    .min(5, "Email is too short")
    .max(100, "Email is too long")
    .regex(emailRegex, "Invalid email format")
    .refine((email) => email.length > 5, {
      message: "Email must be at least 6 characters long",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

function validateUser(user) {
  const result = userSchema.safeParse(user);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((e) => e.message),
    };
  }
  return { success: true, data: result.data };
}

function validateUserUpdate(user) {
  const userUpdateSchema = userSchema.partial();
  const result = userUpdateSchema.safeParse(user);
  if (!result.success) {
    return {
      success: false,
    };
  }
  return { success: true, data: result.data };
}

module.exports = { validateUser, validateUserUpdate };
