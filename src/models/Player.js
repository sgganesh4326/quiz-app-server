import mongoose from "mongoose"

const playerSchema = new mongoose.Schema(
    {
        gameSessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GameSession",
            required: true,
        },

        playerToken: {
            type: String,
            required: true,
            immutable: true,
        },

        nickname: {
            type: String,
            required: true,
            trim: true,
        },

        socketId: {
            type: String,
            default: null,
        },

        score: {
            type: Number,
            default: 0,
        },

        isConnected: {
            type: Boolean,
            default: true,
        },

        joinedAfterGameStarted: {
            type: Boolean,
            default: false,
        },

        joinedAt: {
            type: Date,
            default: Date.now,
        },

        lastConnectedAt: {
            type: Date,
            default: Date.now,
        },

        lastDisconnectedAt: {
            type: Date,
            default: null,
        },

        reconnectCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Player = mongoose.model("Player", playerSchema);
export default Player;