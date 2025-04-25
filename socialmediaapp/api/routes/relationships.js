import express from "express";
import { getRelationships, addRelationship, deleteRelationship, getFollowingUsers } from "../controllers/relationship.js";

const router = express.Router()

router.get("/", getRelationships)
router.post("/", addRelationship)
router.delete("/", deleteRelationship)
router.get("/following", getFollowingUsers)

export default router