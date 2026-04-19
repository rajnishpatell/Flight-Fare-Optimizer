import mongoose from "mongoose";

const searchLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    from: String,
    to: String,
    date: String,
    passengers: Number,
    resultsCount: Number,
    averagePrice: Number,
    cheapestPrice: Number,
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "SearchLog" }
);

export default mongoose.model("SearchLog", searchLogSchema);
