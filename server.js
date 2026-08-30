import express from "express";
import cors from "cors";
import { connectDb } from "./src/config/db.js";
import "dotenv/config";

import authRoutes from "../backend/src/routes/authRoutes.js"
import quizRoutes from "../backend/src/routes/quizRoutes.js";
import questionRoutes from "../backend/src/routes/questionRoutes.js";
import gameSessionRoutes from "../backend/src/routes/gameSessionRoutes.js";
import playerRoutes from "../backend/src/routes/playerRoutes.js";
import playerAnswerRoutes from "../backend/src/routes/playerAnswerRoutes.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";

const app = express();

await connectDb();

app.use(cors());
app.use(express.json());

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use("/users", authRoutes);
app.use("/quizzes", quizRoutes);
app.use("/questions", questionRoutes);
app.use("/game-sessions", gameSessionRoutes);
app.use("/players", playerRoutes);
app.use("/player-answers", playerAnswerRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.listen(5001, () => {
    console.log("Server is running on port 5001");
});