import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
    createComment,
  createPost,
  deletePost,
  getFeedPosts,
  getPostById,
  likePost
} from "../controllers/posts.controller.js";
const router = express.Router();

router.get("/", protectedRoute, getFeedPosts);
router.post("/create", protectedRoute, createPost);
router.delete("/delete/:id", protectedRoute, deletePost);
router.get("/:id", protectedRoute, getPostById);
router.post("/:id/comment", protectedRoute, createComment);
router.post("/:id/like", protectedRoute, likePost);

export default router;
