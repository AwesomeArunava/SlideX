// routes/auth.js
import express from "express";
import {registerWithEmail, verifyEmail, login, logout} from '../controllers/authController.js'; // usually "controllers" plural

const router = express.Router(); // naming: "router" is more common

router.post("/register", registerWithEmail);
router.get("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout",logout);
export default router;
