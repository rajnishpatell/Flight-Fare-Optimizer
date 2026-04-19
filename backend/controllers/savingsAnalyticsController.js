import BookingLog from "../models/BookingLog.js";
import mongoose from "mongoose";

export const getSavingsSummary = async (req, res) => {
  try {
    const userId = req.user;

    const summary = await BookingLog.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalSaved: { $sum: "$savedAmount" },
          totalBookings: { $sum: 1 },
          avgSaving: { $avg: "$savedAmount" },
          hiddenCityCount: {
            $sum: {
              $cond: [{ $eq: ["$bookingType", "hidden-city"] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: summary[0] || {
        totalSaved: 0,
        totalBookings: 0,
        avgSaving: 0,
        hiddenCityCount: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
