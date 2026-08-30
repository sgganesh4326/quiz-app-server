import express from "express";

import {
    createQuizController,
    getAllQuizzesController,
    getQuizByIdController,
    getMyQuizzesController,
    updateQuizController,
    deleteQuizController,
} from "../controllers/quizController.js";

const router = express.Router();

router.post("/", createQuizController);

router.get("/", getAllQuizzesController);

router.get("/my", getMyQuizzesController);

router.get("/:quizId", getQuizByIdController);

router.put("/:quizId", updateQuizController);

router.delete("/:quizId", deleteQuizController);

export default router;