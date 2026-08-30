import mongoose from "mongoose"

const gameSessionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    gameSessionStatus: {
      type: String,
      enum: [
        "LOBBY",
        "QUESTION_OPEN",
        "REVEAL",
        "LEADERBOARD",
        "FINISHED",
      ],
      default: "LOBBY",
    },

    currentQuestionIndex: {
      type: Number,
      default: -1,
      min: -1,
    },

    questionStartedAt: {
      type: Date,
      default: null,
    },

    questionEndsAt: {
      type: Date,
      default: null,
    },

    gameStartedAt: {
      type: Date,
      default: null,
    },

    gameEndedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const GameSession = mongoose.model("GameSession", gameSessionSchema);
export default GameSession;