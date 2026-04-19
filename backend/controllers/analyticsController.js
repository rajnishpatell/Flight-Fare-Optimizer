import SearchLog from "../models/SearchLog.js";
import mongoose from "mongoose";

export const getTotalSearches = async (req, res) => {
  try {
    const userId = req.user;
    const count = await SearchLog.countDocuments({ userId });
    res.json({ success: true, totalSearches: count });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getTopRoutes = async (req, res) => {
  try {
    const userId = req.user;
    const routes = await SearchLog.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: { from: "$from", to: "$to" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({ success: true, routes });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getPriceTrends = async (req, res) => {
  try {
    const userId = req.user;
    const trends = await SearchLog.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $group: {
          _id: "$date",
          avgPrice: { $avg: "$averagePrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, trends });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
