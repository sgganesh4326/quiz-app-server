import {
    getPlayerAnswer,
    getAnswersByQuestion,
    getAnswersByPlayer
} from "../services/playerAnswerService.js";

export async function getPlayerAnswerController(
    req,
    res,
    next
) {
    try {
        const {
            gameSessionId,
            playerId,
            questionId
        } = req.query;

        const answer =
            await getPlayerAnswer(
                gameSessionId,
                playerId,
                questionId
            );

        if (!answer) {
            return res.status(404).json({
                success: false,
                message: "Answer not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: answer
        });

    } catch (error) {
        next(error);
    }
}

export async function getAnswersByQuestionController(
    req,
    res,
    next
) {
    try {
        const {
            gameSessionId,
            questionId
        } = req.params;

        const answers =
            await getAnswersByQuestion(
                gameSessionId,
                questionId
            );

        return res.status(200).json({
            success: true,
            data: answers
        });

    } catch (error) {
        next(error);
    }
}

export async function getAnswersByPlayerController(
    req,
    res,
    next
) {
    try {
        const {
            gameSessionId,
            playerId
        } = req.params;

        const answers =
            await getAnswersByPlayer(
                gameSessionId,
                playerId
            );

        return res.status(200).json({
            success: true,
            data: answers
        });

    } catch (error) {
        next(error);
    }
}