import express from "express";

import {
    createQuestionController,
    getQuestionsByQuizController,
    getQuestionByIdController,
    updateQuestionController,
    deleteQuestionController,
} from "../controllers/questionController.js";

const router = express.Router();

router.post("/quiz/:quizId", createQuestionController);

router.get("/quiz/:quizId", getQuestionsByQuizController);

router.get("/:questionId", getQuestionByIdController);

router.put("/:questionId", updateQuestionController);

router.delete("/:questionId", deleteQuestionController);

export default router;