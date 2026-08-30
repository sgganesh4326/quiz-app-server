import express from "express";

import {
    getPlayerAnswerController,
    getAnswersByQuestionController,
    getAnswersByPlayerController,
} from "../controllers/playerAnswerController.js";

const router = express.Router();

router.get("/", getPlayerAnswerController);

router.get(
    "/game/:gameSessionId/question/:questionId",
    getAnswersByQuestionController
);

router.get(
    "/game/:gameSessionId/player/:playerId",
    getAnswersByPlayerController
);

export default router;