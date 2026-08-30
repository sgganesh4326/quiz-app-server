import mongoose from "mongoose"

const playerAnswerSchema = new mongoose.Schema(
  {
    gameSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameSession",
      required: true,
      index: true,
    },

    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
      index: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },

    selectedOption: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    isCorrect: {
      type: Boolean,
      required: true,
    },

    points: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PlayerAnswer = mongoose.model("PlayerAnswer", playerAnswerSchema);
export default PlayerAnswer;