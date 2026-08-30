import crypto from "crypto";

import GameSession from "../models/gameSession.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";


/**
 * Generate a unique room code
 */
async function generateRoomCode() {
    let roomCode;
    let exists = true;

    while (exists) {
        roomCode = crypto
            .randomBytes(3)
            .toString("hex")
            .toUpperCase();

        exists = await GameSession.exists({
            roomCode,
        });
    }

    return roomCode;
}


/**
 * Create a new game session for a quiz
 */
export async function createGameSession(quizId, hostId) {

    // Check quiz exists
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
        throw new Error("Quiz not found");
    }

    // Ensure quiz has questions
    if (quiz.noOfQuestions === 0) {
        throw new Error(
            "Cannot start a game without questions"
        );
    }

    const roomCode = await generateRoomCode();

    const gameSession = await GameSession.create({
        quizId,
        hostId,
        roomCode,

        gameSessionStatus: "LOBBY",

        currentQuestionIndex: -1,

        gameStartedAt: null,
        questionStartedAt: null,
        questionEndsAt: null,
        gameEndedAt: null,
    });

    return gameSession;
}


/**
 * Get game session by ID
 */
export async function getGameSessionById(gameSessionId) {
    const gameSession = await GameSession.findById(
        gameSessionId
    )
        .populate("quizId", "title noOfQuestions")
        .populate("hostId", "username email");

    if (!gameSession) {
        throw new Error("Game session not found");
    }

    return gameSession;
}


/**
 * Get game session by room code
 */
export async function getGameSessionByRoomCode(roomCode) {
    const gameSession = await GameSession.findOne({
        roomCode: roomCode.toUpperCase().trim(),
    });

    if (!gameSession) {
        throw new Error("Invalid room code");
    }

    return gameSession;
}


/**
 * Get all game sessions created by host
 */
export async function getGameSessionsByHost(hostId) {
    return GameSession.find({
        hostId,
    })
        .populate("quizId", "title")
        .sort({
            createdAt: -1,
        });
}


/**
 * Start the game
 *
 * Moves:
 *
 * LOBBY
 *   ↓
 * QUESTION_OPEN
 */
export async function startGame(
    gameSessionId,
    hostId
) {
    const gameSession =
        await GameSession.findById(gameSessionId);

    if (!gameSession) {
        throw new Error("Game session not found");
    }

    // Ensure correct host
    if (
        gameSession.hostId.toString() !==
        hostId.toString()
    ) {
        throw new Error(
            "You are not authorized to start this game"
        );
    }

    if (
        gameSession.gameSessionStatus !== "LOBBY"
    ) {
        throw new Error(
            "Game has already started"
        );
    }

    const firstQuestion =
        await Question.findOne({
            quizId: gameSession.quizId,
        }).sort({
            createdAt: 1,
        });

    if (!firstQuestion) {
        throw new Error(
            "Quiz does not contain any questions"
        );
    }

    const now = new Date();

    gameSession.gameStartedAt = now;

    gameSession.currentQuestionIndex = 0;

    gameSession.gameSessionStatus =
        "QUESTION_OPEN";

    gameSession.questionStartedAt = now;

    gameSession.questionEndsAt =
        new Date(
            now.getTime() +
            firstQuestion.timeLimitDuration * 1000
        );

    await gameSession.save();

    return {
        gameSession,
        question: firstQuestion,
    };
}


/**
 * Get current question
 */
export async function getCurrentQuestion(
    gameSession
) {
    const questions = await Question.find({
        quizId: gameSession.quizId,
    }).sort({
        createdAt: 1,
    });

    return questions[
        gameSession.currentQuestionIndex
    ];
}


/**
 * Move to the next question
 *
 * QUESTION_OPEN
 *      ↓
 * QUESTION_OPEN
 *
 * OR
 *
 * QUESTION_OPEN
 *      ↓
 * FINISHED
 */
export async function moveToNextQuestion(
    gameSessionId,
    hostId
) {
    const gameSession =
        await GameSession.findById(gameSessionId);

    if (!gameSession) {
        throw new Error("Game session not found");
    }

    if (
        gameSession.hostId.toString() !==
        hostId.toString()
    ) {
        throw new Error(
            "You are not authorized"
        );
    }

    if (
        gameSession.gameSessionStatus !==
        "QUESTION_OPEN"
    ) {
        throw new Error(
            "No active question"
        );
    }

    const questions = await Question.find({
        quizId: gameSession.quizId,
    }).sort({
        createdAt: 1,
    });

    const nextQuestionIndex =
        gameSession.currentQuestionIndex + 1;

    // Game finished
    if (
        nextQuestionIndex >= questions.length
    ) {
        gameSession.gameSessionStatus =
            "FINISHED";

        gameSession.gameEndedAt =
            new Date();

        gameSession.questionStartedAt = null;
        gameSession.questionEndsAt = null;

        await gameSession.save();

        return {
            finished: true,
            gameSession,
            question: null,
        };
    }

    const nextQuestion =
        questions[nextQuestionIndex];

    const now = new Date();

    gameSession.currentQuestionIndex =
        nextQuestionIndex;

    gameSession.questionStartedAt = now;

    gameSession.questionEndsAt =
        new Date(
            now.getTime() +
            nextQuestion.timeLimitDuration * 1000
        );

    await gameSession.save();

    return {
        finished: false,
        gameSession,
        question: nextQuestion,
    };
}


/**
 * Close the current question
 */
export async function closeCurrentQuestion(
    gameSessionId,
    hostId
) {
    const gameSession =
        await GameSession.findById(gameSessionId);

    if (!gameSession) {
        throw new Error(
            "Game session not found"
        );
    }

    if (
        gameSession.hostId.toString() !==
        hostId.toString()
    ) {
        throw new Error(
            "You are not authorized"
        );
    }

    if (
        gameSession.gameSessionStatus !==
        "QUESTION_OPEN"
    ) {
        throw new Error(
            "There is no open question"
        );
    }

    gameSession.gameSessionStatus =
        "REVEAL";

    await gameSession.save();

    return gameSession;
}


/**
 * Show leaderboard
 */
export async function showLeaderboard(
    gameSessionId,
    hostId
) {
    const gameSession =
        await GameSession.findById(gameSessionId);

    if (!gameSession) {
        throw new Error(
            "Game session not found"
        );
    }

    if (
        gameSession.hostId.toString() !==
        hostId.toString()
    ) {
        throw new Error(
            "You are not authorized"
        );
    }

    gameSession.gameSessionStatus =
        "LEADERBOARD";

    await gameSession.save();

    return gameSession;
}


/**
 * Finish game manually
 */
export async function finishGame(
    gameSessionId,
    hostId
) {
    const gameSession =
        await GameSession.findById(gameSessionId);

    if (!gameSession) {
        throw new Error(
            "Game session not found"
        );
    }

    if (
        gameSession.hostId.toString() !==
        hostId.toString()
    ) {
        throw new Error(
            "You are not authorized"
        );
    }

    gameSession.gameSessionStatus =
        "FINISHED";

    gameSession.gameEndedAt =
        new Date();

    gameSession.questionStartedAt = null;
    gameSession.questionEndsAt = null;

    await gameSession.save();

    return gameSession;
}