import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();



const jwtGenaretor = (user, expiresTime) => {

    const payload = { userId: user._id, email: user.email }
    const key = process.env.JWT_KEY
    if (!key) {
        throw new Error("JWT secret key is not defined in environment variables!");
    }
    const token = jwt.sign(payload, key, { expiresIn: expiresTime }); // Token expires in 1 hour
    return token;
}

export default jwtGenaretor;