import {
    getPlayerById,
    getPlayerByToken,
    getPlayersByGameSessionId,
    getConnectedPlayers,
    getLeaderboard,
    getPlayerCount
} from "../services/playerService.js";

export async function getPlayerByIdController(
    req,
    res,
    next
) {
    try {
        const { playerId } = req.params;

        const player = await getPlayerById(
            playerId
        );

        return res.status(200).json({
            success: true,
            data: player
        });

    } catch (error) {
        next(error);
    }
}

export async function getPlayersController(
    req,
    res,
    next
) {
    try {
        const { gameSessionId } = req.params;

        const players =
            await getPlayersByGameSessionId(
                gameSessionId
            );

        return res.status(200).json({
            success: true,
            data: players
        });

    } catch (error) {
        next(error);
    }
}

export async function getConnectedPlayersController(
    req,
    res,
    next
) {
    try {
        const { gameSessionId } = req.params;

        const players =
            await getConnectedPlayers(
                gameSessionId
            );

        return res.status(200).json({
            success: true,
            data: players
        });

    } catch (error) {
        next(error);
    }
}

export async function getLeaderboardController(
    req,
    res,
    next
) {
    try {
        const { gameSessionId } = req.params;

        const leaderboard =
            await getLeaderboard(
                gameSessionId
            );

        return res.status(200).json({
            success: true,
            data: leaderboard
        });

    } catch (error) {
        next(error);
    }
}

export async function getPlayerCountController(
    req,
    res,
    next
) {
    try {
        const { gameSessionId } = req.params;

        const count =
            await getPlayerCount(
                gameSessionId
            );

        return res.status(200).json({
            success: true,
            data: {
                count
            }
        });

    } catch (error) {
        next(error);
    }
}

import {
    joinGame,
    rejoinGame,
    disconnectPlayer,
} from "../services/playerService.js";


/**
 * Join Game
 *
 * POST /players/join
 *
 * Body:
 * {
 *   "roomCode": "ABC123",
 *   "nickname": "Ganesh",
 *   "playerToken": "optional-token",
 *   "socketId": "optional-socket-id"
 * }
 */
export async function joinGameController(
    req,
    res,
    next
) {
    try {
        const {
            roomCode,
            nickname,
            playerToken,
            socketId,
        } = req.body;

        if (!roomCode) {
            return res.status(400).json({
                success: false,
                message: "Room code is required",
            });
        }

        const result = await joinGame(
            roomCode,
            nickname,
            playerToken,
            socketId
        );

        return res.status(result.type === "JOIN"
                ? 201
                : 200
        ).json({
            success: true,
            message: getJoinMessage(result.type),
            data: result,
        });

    } catch (error) {
        next(error);
    }
}


/**
 * Rejoin Game
 *
 * POST /players/rejoin
 *
 * Body:
 * {
 *   "roomCode": "ABC123",
 *   "playerToken": "player-token",
 *   "socketId": "optional-socket-id"
 * }
 */
export async function rejoinGameController(
    req,
    res,
    next
) {
    try {
        const {
            roomCode,
            playerToken,
            socketId,
        } = req.body;

        if (!roomCode) {
            return res.status(400).json({
                success: false,
                message: "Room code is required",
            });
        }

        if (!playerToken) {
            return res.status(400).json({
                success: false,
                message: "Player token is required",
            });
        }

        const player = await rejoinGame(
            roomCode,
            playerToken,
            socketId
        );

        return res.status(200).json({
            success: true,
            message: "Player rejoined successfully",
            data: player,
        });

    } catch (error) {
        next(error);
    }
}


/**
 * Disconnect Player
 *
 * POST /players/disconnect
 *
 * Body:
 * {
 *   "socketId": "socket-id"
 * }
 */
export async function disconnectPlayerController(
    req,
    res,
    next
) {
    try {
        const { socketId } = req.body;

        if (!socketId) {
            return res.status(400).json({
                success: false,
                message: "Socket ID is required",
            });
        }

        const player = await disconnectPlayer(
            socketId
        );

        if (!player) {
            return res.status(404).json({
                success: false,
                message: "Connected player not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Player disconnected successfully",
            data: player,
        });

    } catch (error) {
        next(error);
    }
}


/**
 * Helper function
 */
function getJoinMessage(type) {

    switch (type) {

        case "JOIN":
            return "Player joined successfully";

        case "LATE_JOIN":
            return "Player joined after game started";

        case "REJOIN":
            return "Player rejoined successfully";

        default:
            return "Player joined successfully";
    }
}