import express from "express";
import cors from "cors";
import { connectDb } from "./src/config/db.js";
import "dotenv/config";

import authRoutes from "./src/routes/authRoutes.js";
import quizRoutes from "./src/routes/quizRoutes.js";
import questionRoutes from "./src/routes/questionRoutes.js";
import gameSessionRoutes from "./src/routes/gameSessionRoutes.js";
import playerRoutes from "./src/routes/playerRoutes.js";
import playerAnswerRoutes from "./src/routes/playerAnswerRoutes.js";

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