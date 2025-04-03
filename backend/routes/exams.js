const express = require("express");
const ExamController = require("../controllers/exam.js");

const examsRouter = express.Router();

examsRouter.post("/", ExamController.createExam);
examsRouter.get("/:id", ExamController.getExamById);
examsRouter.delete("/:id", ExamController.deleteExamById);

examsRouter.get("/user/:userId", ExamController.getExamsByUserId);

module.exports = examsRouter;
