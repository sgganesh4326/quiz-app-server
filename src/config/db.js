import mongoose from "mongoose";

const uri = "mongodb+srv://ganesh:Gani%404326@cluster0.sicpuzm.mongodb.net/quiz?retryWrites=true&w=majority";

export async function connectDb() {
    try {
        await mongoose.connect(uri);

        console.log("Connected to MongoDB");
        console.log("Using database:", mongoose.connection.name);

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}