// routes/auth.js
import express from "express";
import { createSlide, updateSlide, showSlides, getSlideDeck, updatePreview, updateTitle } from "../controllers/slideXController.js";

const router = express.Router();

router.post("/createSlide", createSlide);
router.put("/updateSlide", updateSlide);
router.post("/showSlides", showSlides);
router.get("/:id", getSlideDeck);
router.post("/updatePreview", updatePreview);
router.post("/updateTitle", updateTitle);

export default router;
