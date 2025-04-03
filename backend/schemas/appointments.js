const z = require("zod");

const appointmentSchema = z.object({
  user_id: z.number().int().positive("User ID must be a positive integer"),
  pet_id: z.number().int().positive("Pet ID must be a positive integer"),
  date: z.string().date("Invalid date format"),
  status: z.string().min(1, "Status is required"),
  payment_method: z.string().optional(),
});

function validateAppointment(appointment) {
  const result = appointmentSchema.safeParse(appointment);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((e) => e.message),
    };
  }
  return { success: true, data: result.data };
}

function validateAppointmentUpdate(appointment) {
  const appointmentUpdateSchema = appointmentSchema.partial();
  const result = appointmentUpdateSchema.safeParse(appointment);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((e) => e.message),
    };
  }
  return { success: true, data: result.data };
}

module.exports = { validateAppointment, validateAppointmentUpdate };
