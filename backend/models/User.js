import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },

    verified: { type: Boolean, default: false },
    verifyToken: String,
    verifyTokenExpires: Date,

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    // email change verification fields
    pendingEmail: String,
    emailChangeToken: String,
    emailChangeExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
