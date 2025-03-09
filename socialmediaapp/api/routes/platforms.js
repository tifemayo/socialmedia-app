import express from "express";
import { saveUserPlatforms, getUserPlatforms } from "../controllers/platforms.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Save user platforms
router.post("/", verifyToken, saveUserPlatforms);
// Get user platforms
router.get("/", verifyToken, getUserPlatforms);

export default router;