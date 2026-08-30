import express from "express";

import {
    getPlayerByIdController,
    getPlayersController,
    getConnectedPlayersController,
    getLeaderboardController,
    getPlayerCountController,
    joinGameController,
    rejoinGameController,
    disconnectPlayerController,
} from "../controllers/playerController.js";

const router = express.Router();

router.get(
    "/game/:gameSessionId",
    getPlayersController
);

router.get(
    "/game/:gameSessionId/connected",
    getConnectedPlayersController
);

router.get(
    "/game/:gameSessionId/leaderboard",
    getLeaderboardController
);

router.get(
    "/game/:gameSessionId/count",
    getPlayerCountController
);

router.get(
    "/:playerId",
    getPlayerByIdController
);

/**
 * Player joins a game
 */
router.post(
    "/join",
    joinGameController
);


/**
 * Player explicitly rejoins a game
 */
router.post(
    "/rejoin",
    rejoinGameController
);


/**
 * Mark player as disconnected
 *
 * Temporary REST endpoint.
 * Later this should be triggered
 * by Socket.IO disconnect event.
 */
router.post(
    "/disconnect",
    disconnectPlayerController
);


export default router;