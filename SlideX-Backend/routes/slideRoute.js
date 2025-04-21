// routes/auth.js
import express from "express";
import { createSlide, updateSlide } from "../controllers/slideXController.js";

const router = express.Router(); // naming: "router" is more common

router.post("/createSlide", createSlide)
router.put("/updateSlide", updateSlide)

export default router;