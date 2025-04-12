import express from "express";
import { saveUserPlatforms, getUserPlatforms, deletePlatform } from "../controllers/platforms.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Save platforms (used by both signup and edit)
router.post("/", saveUserPlatforms); // For signup (no token required)
router.put("/", verifyToken, saveUserPlatforms); // For editing (token required)

// Get user platforms
router.get("/", verifyToken, getUserPlatforms);

// Delete a specific platform for a user
router.delete("/", verifyToken, deletePlatform);

export default router;