import express from "express";
import { getSavingsSummary } from "../controllers/savingsAnalyticsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/summary", authMiddleware, getSavingsSummary);

export default router;
