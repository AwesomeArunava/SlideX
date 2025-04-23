import express from "express";
import { 
  createSlide, 
  updateSlide, 
  showSlides, 
  getSlideDeck, 
  updatePreview, 
  updateTitle,
  deleteSlide 
} from "../controllers/slideXController.js";

const router = express.Router();

router.post("/createSlide", createSlide);
router.put("/updateSlide", updateSlide);
router.post("/showSlides", showSlides);
router.get("/:id", getSlideDeck);
router.post("/updatePreview", updatePreview);
router.post("/updateTitle", updateTitle);
router.post("/deleteSlide", (req, res, next) => {
  deleteSlide(req, res).catch(err => {
    console.error('Delete error:', err);
    res.status(500).json({ message: "Internal server error" });
  });
});

export default router;
