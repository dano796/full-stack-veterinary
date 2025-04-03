const ExamModel = require("../models/exam");
const { validateExam } = require("../schemas/exams");

class ExamController {
  static async createExam(req, res) {
    try {
      const validationResult = validateExam(req.body);
      if (!validationResult.success)
        return res.status(400).json({ errors: validationResult.errors });

      const { pet_id, exam_type, date, result, status, payment_method } =
        validationResult.data;
      const newExam = await ExamModel.createExam(
        pet_id,
        exam_type,
        date,
        result,
        status,
        payment_method
      );
      res.status(201).json(newExam);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getExamById(req, res) {
    try {
      const exam = await ExamModel.findById(req.params.id);
      if (!exam) return res.status(404).json({ message: "Exam not found" });
      res.status(200).json(exam);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteExamById(req, res) {
    try {
      const deleted = await ExamModel.deleteById(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Exam not found" });
      res.status(200).json({ message: "Exam deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getExamsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const exams = await ExamModel.findByUserId(userId);
      res.status(200).json(exams);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ExamController;
