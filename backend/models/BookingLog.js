import mongoose from "mongoose";

const bookingLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    from: String,
    to: String,
    airline: String,

    bookingType: {
      type: String,
      enum: ["direct", "hidden-city"],
      required: true,
    },

    bookedPrice: Number,
    directPrice: Number,
    savedAmount: Number,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "BookingLog" }
);

export default mongoose.model("BookingLog", bookingLogSchema);
