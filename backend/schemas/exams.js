const z = require("zod");

const examSchema = z.object({
  pet_id: z.number().int().positive("Pet ID must be a positive integer"),
  exam_type: z.string().min(1, "Exam type is required"),
  date: z.string().date("Invalid date format"),
  result: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  payment_method: z.string().optional(),
});

function validateExam(exam) {
  const result = examSchema.safeParse(exam);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((e) => e.message),
    };
  }
  return { success: true, data: result.data };
}

function validateExamUpdate(exam) {
  const examUpdateSchema = examSchema.partial();
  const result = examUpdateSchema.safeParse(exam);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((e) => e.message),
    };
  }
  return { success: true, data: result.data };
}

module.exports = { validateExam, validateExamUpdate };
