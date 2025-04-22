// routes/auth.js
import express from "express";
import {registerWithEmail, verifyEmail, login, logout, guestToUser} from '../controllers/authController.js';
import authenticateUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/register", registerWithEmail);
router.get("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/guest-to-user", guestToUser);
export default router;
