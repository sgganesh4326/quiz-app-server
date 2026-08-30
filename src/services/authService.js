import bcrypt from "bcrypt";
import User from "../models/User.js";

export async function loginUser(email, password) {
    const user = await getUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    return user;
}

export async function registerUser(email, password, username) {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        throw new Error("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        username: username.trim(),
        role: "ADMIN"
    });

    return user;
}

export async function getUserByEmail(email) {
    const user = await User.findOne({
        email: email.toLowerCase().trim()
    });

    return user;
}

export async function getUserById(userId) {
    const user = await User.findById(userId);

    return user;
}