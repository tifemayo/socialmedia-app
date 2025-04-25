import express from "express";
import { getUser, updateUser, getSuggestions} from "../controllers/users.js";
const router = express.Router()

router.get("/find/:userId", getUser)
router.put("/", updateUser)
router.get("/suggestions", getSuggestions);

export default router