import Quiz from "../models/quiz.js";
import Question from "../models/question.js";
import mongoose from "mongoose";

export async function createQuestion(
    quizId,
    questionText,
    options,
    answerOption,
    timeLimitDuration
) {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
        throw new Error("Quiz not found");
    }

    if (!questionText?.trim()) {
        throw new Error("Question text is required");
    }

    if (!Array.isArray(options) || options.length < 2) {
        throw new Error("At least 2 options are required");
    }

    if (!answerOption?.trim()) {
        throw new Error("Answer option is required");
    }

    const formattedOptions = options.map((option) => ({
        _id: new mongoose.Types.ObjectId(),
        text: option.trim()
    }));

    const correctOption = formattedOptions.find(
        (option) =>
            option.text === answerOption.trim()
    );

    if (!correctOption) {
        throw new Error(
            "Answer option must match one of the provided options"
        );
    }

    console.log("CORRECT OPTION:", correctOption);

    const question = await Question.create({
        quizId,
        questionText: questionText.trim(),
        options: formattedOptions,
        answerOption: correctOption._id,
        timeLimitDuration
    });

    await Quiz.findByIdAndUpdate(
        quizId,
        {
            $inc: {
                noOfQuestions: 1
            }
        }
    );

    return question;
}


export async function getQuestionsByQuizId(quizId) {
    return Question.find({
        quizId,
    });
}


export async function getQuestionById(questionId) {
    const question = await Question.findById(questionId);

    if (!question) {
        throw new Error("Question not found");
    }

    return question;
}


export async function updateQuestion(
    questionId,
    {
        questionText,
        options,
        answerOption,
        timeLimitDuration,
    }
) {
    const question = await Question.findById(questionId);

    if (!question) {
        throw new Error("Question not found");
    }

    if (questionText !== undefined) {
        question.questionText = questionText.trim();
    }

    if (options !== undefined) {
        question.options = options;
    }

    if (answerOption !== undefined) {
        question.answerOption = answerOption;
    }

    if (timeLimitDuration !== undefined) {
        question.timeLimitDuration = timeLimitDuration;
    }

    await question.save();

    return question;
}


export async function deleteQuestion(questionId) {
    const question = await Question.findById(questionId);

    if (!question) {
        throw new Error("Question not found");
    }

    await Question.findByIdAndDelete(questionId);

    await Quiz.findByIdAndUpdate(
        question.quizId,
        {
            $inc: {
                noOfQuestions: -1,
            },
        }
    );

    return {
        message: "Question deleted successfully",
    };
}

