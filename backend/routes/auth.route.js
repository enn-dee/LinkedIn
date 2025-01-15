import express from "express";
import { getCurrentUser, logout, signin, signup } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/logout", logout)

router.get("/me", protectedRoute, getCurrentUser);


export default router