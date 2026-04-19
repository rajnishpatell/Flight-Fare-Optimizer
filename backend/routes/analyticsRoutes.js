import express from "express";
import {
  getTotalSearches,
  getTopRoutes,
  getPriceTrends
} from "../controllers/analyticsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/total-searches", authMiddleware, getTotalSearches);
router.get("/top-routes", authMiddleware, getTopRoutes);
router.get("/price-trends", authMiddleware, getPriceTrends);

export default router;
