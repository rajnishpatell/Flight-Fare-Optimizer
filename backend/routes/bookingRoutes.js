import express from "express";
import { simulateBooking } from "../controllers/bookingController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/simulate", authMiddleware, simulateBooking);

export default router;
