import { getUserByEmail, registerUser } from "../services/authService.js";

export async function login(req, res) {
    console.log("Login attempt");
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message: "Email or Password can not be empty"
            });
        }

        const user = await getUserByEmail(email);

        return res.status(200).json({
            message: "Login success",
            user : {
                email: user.email,
                userId: user._id
            }
        });
    } catch(e) {
        console.log("Login failed, ", e);
    }

}

export async function register(req, res) {
    const {email, password, username} = req.body;

    if(!email || !password) {
        return res.status(400).json({
            message: "Email or Password can not be empty"
        });
    }

    const user = await registerUser(email, hashedPassword, username);

    return res.status(200).json({
        message: "register success",
        user: user
    });
}

export async function getUserById(req, res, next) {
    try {
        const { userId } = req.params;

        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        next(error);
    }
}