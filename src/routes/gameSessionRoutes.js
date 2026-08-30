import express from "express";

import {
    createGameSessionController,
    getGameSessionByIdController,
    getGameSessionByRoomCodeController,
    getMyGameSessionsController,
    startGameController,
    closeCurrentQuestionController,
    showLeaderboardController,
    moveToNextQuestionController,
    finishGameController,
} from "../controllers/gameSessionController.js";

const router = express.Router();

router.post("/", createGameSessionController);

router.get("/my", getMyGameSessionsController);

router.get("/room/:roomCode", getGameSessionByRoomCodeController);

router.get("/:gameSessionId", getGameSessionByIdController);

router.post("/:gameSessionId/start", startGameController);

router.post(
    "/:gameSessionId/close-question",
    closeCurrentQuestionController
);

router.post(
    "/:gameSessionId/leaderboard",
    showLeaderboardController
);

router.post(
    "/:gameSessionId/next-question",
    moveToNextQuestionController
);

router.post(
    "/:gameSessionId/finish",
    finishGameController
);

export default router;