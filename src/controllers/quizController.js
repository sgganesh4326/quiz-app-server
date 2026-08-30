import {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    getQuizzesByUserId,
    updateQuiz,
    deleteQuiz
} from "../services/quizService.js";


export async function createQuizController(req, res, next) {
    try {
        const { title, userId } = req.body;

        // Later this should come from JWT
        // const userId = req.user.id;

        const quiz = await createQuiz(
            title,
            userId
        );

        return res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            data: quiz
        });

    } catch (error) {
        next(error);
    }
}


export async function getAllQuizzesController(req, res, next) {
    try {
        const quizzes = await getAllQuizzes();

        return res.status(200).json({
            success: true,
            data: quizzes
        });

    } catch (error) {
        next(error);
    }
}


export async function getQuizByIdController(req, res, next) {
    try {
        const { quizId } = req.params;

        const quiz = await getQuizById(quizId);

        return res.status(200).json({
            success: true,
            data: quiz
        });

    } catch (error) {
        next(error);
    }
}


export async function getMyQuizzesController(req, res, next) {
    try {
        const userId = req.user.id;

        const quizzes = await getQuizzesByUserId(
            userId
        );

        return res.status(200).json({
            success: true,
            data: quizzes
        });

    } catch (error) {
        next(error);
    }
}


export async function updateQuizController(req, res, next) {
    try {
        const { quizId } = req.params;
        const { title } = req.body;

        const userId = req.user.id;

        const quiz = await updateQuiz(
            quizId,
            title,
            userId
        );

        return res.status(200).json({
            success: true,
            message: "Quiz updated successfully",
            data: quiz
        });

    } catch (error) {
        next(error);
    }
}


export async function deleteQuizController(req, res, next) {
    try {
        const { quizId } = req.params;

        const userId = req.user.id;

        const result = await deleteQuiz(
            quizId,
            userId
        );

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {
        next(error);
    }
}