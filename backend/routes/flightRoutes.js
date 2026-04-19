import express from "express";
import { searchFlights } from "../controllers/flightController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/search", searchFlights);

export default router;
