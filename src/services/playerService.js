import crypto from "crypto";

import Player from "../models/player.js";
import GameSession from "../models/gameSession.js";


/**
 * Join or rejoin a game
 */
export async function joinGame(
    roomCode,
    nickname,
    playerToken,
    socketId
) {
    const gameSession = await GameSession.findOne({
            roomCode: roomCode
                .toUpperCase()
                .trim(),
        });

    if (!gameSession) {
        throw new Error(
            "Game session not found"
        );
    }

    // Cannot join after game finished
    if (
        gameSession.gameSessionStatus ==="FINISHED"
    ) {
        throw new Error(
            "Game has already finished"
        );
    }

    /*
     * REJOIN
     *
     * If player already has a token,
     * restore the existing player.
     */
    if (playerToken) {
        const existingPlayer =await Player.findOne({
                gameSessionId:gameSession._id,
                playerToken,
            });

        if (existingPlayer) {
            existingPlayer.socketId = socketId;

            existingPlayer.isConnected = true;

            existingPlayer.lastConnectedAt = new Date();

            existingPlayer.reconnectCount += 1;

            await existingPlayer.save();

            return {
                type: "REJOIN",
                player: existingPlayer,
                gameSession,
            };
        }
    }


    /*
     * NEW PLAYER
     */

    if (!nickname?.trim()) {
        throw new Error(
            "Nickname is required"
        );
    }

    /*
     * Check duplicate nickname
     *
     * This is useful so leaderboard names
     * don't become confusing.
     */
    const existingNickname = await Player.findOne({
            gameSessionId: gameSession._id,
            nickname: {$regex:`^${nickname.trim()}$`,$options: "i",},
        });

    if (existingNickname) {
        throw new Error(
            "Nickname is already taken"
        );
    }


    /*
     * Late join
     */
    const isLateJoin = gameSession.gameStartedAt !== null;


    /*
     * Generate player token
     */
    const newPlayerToken = crypto.randomUUID();

    const now = new Date();

    const player = await Player.create({
            gameSessionId: gameSession._id,
            playerToken: newPlayerToken,
            nickname: nickname.trim(),
            socketId,
            isConnected: true,
            score: 0,
            joinedAt: now,
            joinedAfterGameStarted: isLateJoin,
            lastConnectedAt: now,
            reconnectCount: 0,
            lastDisconnectedAt: null,
        });

    return {
        type: isLateJoin? "LATE_JOIN" : "JOIN",
        player,
        gameSession,
    };
}


/**
 * Reconnect player
 *
 * This can also be used separately
 * instead of joinGame().
 */
export async function rejoinGame(
    roomCode,
    playerToken,
    socketId
) {
    const gameSession =
        await GameSession.findOne({
            roomCode:
                roomCode.toUpperCase().trim(),
        });

    if (!gameSession) {
        throw new Error(
            "Game session not found"
        );
    }

    const player =
        await Player.findOne({
            gameSessionId:
                gameSession._id,

            playerToken,
        });

    if (!player) {
        throw new Error(
            "Player not found"
        );
    }

    player.socketId = socketId;

    player.isConnected = true;

    player.lastConnectedAt =
        new Date();

    player.reconnectCount += 1;

    await player.save();

    return player;
}


/**
 * Mark player as disconnected
 *
 * Called from:
 *
 * socket.on("disconnect")
 */
export async function disconnectPlayer(
    socketId
) {
    const player =
        await Player.findOne({
            socketId,
        });

    if (!player) {
        return null;
    }

    player.isConnected = false;

    player.lastDisconnectedAt =
        new Date();

    player.socketId = null;

    await player.save();

    return player;
}


/**
 * Get player by ID
 */
export async function getPlayerById(
    playerId
) {
    const player =
        await Player.findById(playerId);

    if (!player) {
        throw new Error(
            "Player not found"
        );
    }

    return player;
}


/**
 * Get player by token
 */
export async function getPlayerByToken(
    gameSessionId,
    playerToken
) {
    const player =
        await Player.findOne({
            gameSessionId,
            playerToken,
        });

    return player;
}


/**
 * Get all players in a game
 */
export async function getPlayersByGameSessionId(
    gameSessionId
) {
    return Player.find({
        gameSessionId,
    }).sort({
        score: -1,
        joinedAt: 1,
    });
}


/**
 * Get connected players
 */
export async function getConnectedPlayers(
    gameSessionId
) {
    return Player.find({
        gameSessionId,
        isConnected: true,
    }).sort({
        score: -1,
    });
}


/**
 * Update player score
 *
 * Usually called internally
 * by gameService.
 */
export async function addPlayerScore(
    playerId,
    points
) {
    if (points < 0) {
        throw new Error(
            "Points cannot be negative"
        );
    }

    const player =
        await Player.findByIdAndUpdate(
            playerId,
            {
                $inc: {
                    score: points,
                },
            },
            {
                new: true,
            }
        );

    if (!player) {
        throw new Error(
            "Player not found"
        );
    }

    return player;
}


/**
 * Get leaderboard
 */
export async function getLeaderboard(
    gameSessionId
) {
    const players =
        await Player.find({
            gameSessionId,
        })
            .select(
                "nickname score isConnected joinedAt"
            )
            .sort({
                score: -1,
                joinedAt: 1,
            })
            .lean();

    return players.map(
        (player, index) => ({
            rank: index + 1,

            playerId:
                player._id,

            nickname:
                player.nickname,

            score:
                player.score,

            isConnected:
                player.isConnected,
        })
    );
}


/**
 * Get player count
 */
export async function getPlayerCount(
    gameSessionId
) {
    return Player.countDocuments({
        gameSessionId,
    });
}