import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
  acceptConnectionRequest,
  getConnectionRequests,
  getConnectionStatus,
  getUserConnections,
  rejectConnectionRequest,
  removeConnection,
  sendConnectionRequest,
} from "../controllers/connection.controller.js";
const router = express.Router();

router.post("/request/:userId", protectedRoute, sendConnectionRequest);
router.put("/accept/:requestId", protectedRoute, acceptConnectionRequest);
router.put("/reject/:requestId", protectedRoute, rejectConnectionRequest);
router.get("/requests", protectedRoute, getConnectionRequests);
router.get("/", protectedRoute, getUserConnections);
router.delete("/:userId", protectedRoute, removeConnection);
router.get("/status/:userId", protectedRoute, getConnectionStatus)

export default router;
