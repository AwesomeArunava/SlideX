// routes/auth.js
import express from "express";
import { createSlide, updateSlide, showSlides } from "../controllers/slideXController.js";

const router = express.Router();

router.post("/createSlide", createSlide);
router.put("/updateSlide", updateSlide);
router.post("/showSlides", showSlides);

export default router;
