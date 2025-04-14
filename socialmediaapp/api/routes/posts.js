import express from "express";
import { getPosts, addPost, deletePost, searchPosts } from "../controllers/posts.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.get("/search", searchPosts);

export default router;
