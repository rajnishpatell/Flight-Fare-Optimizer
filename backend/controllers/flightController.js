import { generateMockFlights } from "../utils/flightAPI.js";
import SearchLog from "../models/SearchLog.js";

export const searchFlights = async (req, res) => {
  try {
    const { from, to, date, passengers } = req.body;

    const flights = generateMockFlights(from, to, date, passengers);

    // Save analytics log
    await SearchLog.create({
      userId: req.user,
      from,
      to,
      date,
      passengers,
      resultsCount: flights.length,
      averagePrice:
        flights.reduce((sum, f) => sum + f.price, 0) / flights.length,
      cheapestPrice: Math.min(...flights.map((f) => f.price)),
    });

    res.json({ success: true, flights });
  } catch (error) {
    console.error("Flight search error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
