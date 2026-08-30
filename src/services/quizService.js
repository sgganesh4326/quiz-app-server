import Quiz from "../models/quiz.js";


export async function createQuiz(title, userId) {
    if (!title || !title.trim()) {
        throw new Error("Quiz title is required");
    }

    const quiz = await Quiz.create({
        title: title.trim(),
        createdBy: userId,
    });

    return quiz;
}


export async function getAllQuizzes() {
    const quizzes = await Quiz.find()
        .populate("createdBy", "username email")
        .sort({ createdAt: -1 });

    return quizzes;
}


export async function getQuizById(quizId) {
    const quiz = await Quiz.findById(quizId)
        .populate("createdBy", "username email");

    if (!quiz) {
        throw new Error("Quiz not found");
    }

    return quiz;
}


export async function getQuizzesByUserId(userId) {
    const quizzes = await Quiz.find({
        createdBy: userId,
    }).sort({ createdAt: -1 });

    return quizzes;
}


export async function updateQuiz(quizId, title, userId) {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
        throw new Error("Quiz not found");
    }

    // Ensure only the creator can update the quiz
    if (quiz.createdBy.toString() !== userId.toString()) {
        throw new Error("You are not authorized to update this quiz");
    }

    if (!title || !title.trim()) {
        throw new Error("Quiz title is required");
    }

    quiz.title = title.trim();

    await quiz.save();

    return quiz;
}


export async function deleteQuiz(quizId, userId) {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
        throw new Error("Quiz not found");
    }

    // Ensure only the creator can delete it
    if (quiz.createdBy.toString() !== userId.toString()) {
        throw new Error("You are not authorized to delete this quiz");
    }

    await Quiz.findByIdAndDelete(quizId);

    return {
        message: "Quiz deleted successfully",
    };
}