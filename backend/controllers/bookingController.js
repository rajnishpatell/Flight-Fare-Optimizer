import BookingLog from "../models/BookingLog.js";

export const simulateBooking = async (req, res) => {
  try {
    const userId = req.user;

    const {
      from,
      to,
      airline,
      bookingType,
      bookedPrice,
      directPrice,
      savedAmount,
    } = req.body;

    const booking = await BookingLog.create({
      userId,
      from,
      to,
      airline,
      bookingType,
      bookedPrice,
      directPrice,
      savedAmount,
    });

    res.json({
      success: true,
      message: "Booking simulated successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
