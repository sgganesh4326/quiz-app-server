import {
    createGameSession,
    getGameSessionById,
    getGameSessionByRoomCode,
    getGameSessionsByHost,
    startGame,
    closeCurrentQuestion,
    showLeaderboard,
    moveToNextQuestion,
    finishGame
} from "../services/gameSessionService.js";

export async function createGameSessionController(
    req,
    res,
    next
) {
    console.log("create game session: ", req.body);
    try {
        const { quizId, hostId } = req.body;

        const gameSession =
            await createGameSession(
                quizId,
                hostId
            );

        return res.status(201).json({
            success: true,
            message: "Game session created successfully",
            data: gameSession
        });

    } catch (error) {
        next(error);
    }
}

export async function getGameSessionByIdController(
    req,
    res,
    next
) {
    try {
        const { gameSessionId } = req.params;

        const gameSession =
            await getGameSessionById(gameSessionId);

        return res.status(200).json({
            success: true,
            data: gameSession
        });

    } catch (error) {
        next(error);
    }
}

export async function getGameSessionByRoomCodeController(
    req,
    res,
    next
) {
    try {
        const { roomCode } = req.params;

        const gameSession =
            await getGameSessionByRoomCode(roomCode);

        return res.status(200).json({
            success: true,
            data: gameSession
        });

    } catch (error) {
        next(error);
    }
}

export async function getMyGameSessionsController(
    req,
    res,
    next
) {
    try {
        const hostId = req.user.id;

        const sessions =
            await getGameSessionsByHost(hostId);

        return res.status(200).json({
            success: true,
            data: sessions
        });

    } catch (error) {
        next(error);
    }
}

export async function startGameController(
    req,
    res,
    next
) {
    try {
        const { gameSessionId } = req.params;
        const {hostId} = req.body;

        const result = await startGame(
            gameSessionId,
            hostId
        );

        return res.status(200).json({
            success: true,
            message: "Game started successfully",
            data: result
        });

    } catch (error) {
        next(error);
    }
}

export async function closeCurrentQuestionController(
    req,
    res,
    next
) {
    try {
        const { gameSessionId } = req.params;
        const hostId = req.user.id;

        const gameSession =
            await closeCurrentQuestion(
                gameSessionId,
                hostId
            );

        return res.status(200).json({
            success: true,
            message: "Question closed successfully",
            data: gameSession
        });

    } catch (error) {
        next(error);
    }
}

export async function showLeaderboardController(
    req,
    res,
    next
) {
    try {
        const { gameSessionId } = req.params;
        const hostId = req.user.id;

        const gameSession =
            await showLeaderboard(
                gameSessionId,
                hostId
            );

        return res.status(200).json({
            success: true,
            message: "Leaderboard displayed",
            data: gameSession
        });

    } catch (error) {
        next(error);
    }
}

export async function moveToNextQuestionController(
    req,
    res,
    next
) {
    try {
        const { gameSessionId } = req.params;
        const hostId = req.user.id;

        const result =
            await moveToNextQuestion(
                gameSessionId,
                hostId
            );

        return res.status(200).json({
            success: true,
            message: result.finished
                ? "Game finished"
                : "Next question started",
            data: result
        });

    } catch (error) {
        next(error);
    }
}

export async function finishGameController(
    req,
    res,
    next
) {
    try {
        const { gameSessionId } = req.params;
        const hostId = req.user.id;

        const gameSession =
            await finishGame(
                gameSessionId,
                hostId
            );

        return res.status(200).json({
            success: true,
            message: "Game finished successfully",
            data: gameSession
        });

    } catch (error) {
        next(error);
    }
}