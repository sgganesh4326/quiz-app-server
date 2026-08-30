import PlayerAnswer from "../models/playerAnswer.js";

export async function createPlayerAnswer({
    gameSessionId,
    playerId,
    questionId,
    selectedOption,
    isCorrect,
    points,
}) {
    const playerAnswer = await PlayerAnswer.create({
        gameSessionId,
        playerId,
        questionId,
        selectedOption,
        submittedAt: new Date(),
        isCorrect,
        points,
    });

    return playerAnswer;
}

export async function getPlayerAnswer(
    gameSessionId,
    playerId,
    questionId
) {
    return PlayerAnswer.findOne({
        gameSessionId,
        playerId,
        questionId,
    });
}

export async function getAnswersByQuestion(
    gameSessionId,
    questionId
) {
    return PlayerAnswer.find({
        gameSessionId,
        questionId,
    });
}

export async function getAnswersByPlayer(
    gameSessionId,
    playerId
) {
    return PlayerAnswer.find({
        gameSessionId,
        playerId,
    });
}