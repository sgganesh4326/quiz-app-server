import mongoose from "mongoose"

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
});

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [optionSchema],
      required: true,
      validate: {
        validator: function (options) {
          return options.length >= 2 && options.length <= 6;
        },
        message: "A question must have between 2 and 6 options",
      },
    },

    answerOption: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    timeLimitDuration: {
      type: Number,
      required: true,
      min: 5,
      max: 300,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;