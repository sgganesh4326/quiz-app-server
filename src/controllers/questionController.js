import {
    createQuestion,
    getQuestionsByQuizId,
    getQuestionById,
    updateQuestion,
    deleteQuestion
} from "../services/questionService.js";


export async function createQuestionController(
    req,
    res,
    next
) {
    try {
        console.log("REQ:", req.body);
        const { quizId } = req.params;

        const {
            questionText,
            options,
            answerOption,
            timeLimitDuration
        } = req.body;

        const question = await createQuestion(
            quizId,
            questionText,
            options,
            answerOption,
            timeLimitDuration
        );

        return res.status(201).json({
            success: true,
            message: "Question created successfully",
            data: question
        });

    } catch (error) {
        next(error);
    }
}


export async function getQuestionsByQuizController(
    req,
    res,
    next
) {
    try {
        const { quizId } = req.params;

        const questions =
            await getQuestionsByQuizId(quizId);

        return res.status(200).json({
            success: true,
            data: questions
        });

    } catch (error) {
        next(error);
    }
}


export async function getQuestionByIdController(
    req,
    res,
    next
) {
    try {
        const { questionId } = req.params;

        const question = await getQuestionById(
            questionId
        );

        return res.status(200).json({
            success: true,
            data: question
        });

    } catch (error) {
        next(error);
    }
}


export async function updateQuestionController(
    req,
    res,
    next
) {
    try {
        const { questionId } = req.params;

        const question = await updateQuestion(
            questionId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Question updated successfully",
            data: question
        });

    } catch (error) {
        next(error);
    }
}


export async function deleteQuestionController(
    req,
    res,
    next
) {
    try {
        const { questionId } = req.params;

        const result = await deleteQuestion(
            questionId
        );

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {
        next(error);
    }
}