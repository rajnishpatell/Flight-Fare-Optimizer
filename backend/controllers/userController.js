import User from "../models/User.js";
import bcrypt from "bcryptjs";
import SearchLog from "../models/SearchLog.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import emailExistence from "email-existence";

// Email format validation
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};

// Check if email inbox exists
const checkEmailExists = (email) => {
  return new Promise((resolve) => {
    emailExistence.check(email, (error, response) => {
      resolve(response); // true or false
    });
  });
};

// ----------------------------
// 1. GET /api/user/me
// ----------------------------
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------------------
// 2. PUT /api/user/update
// ----------------------------
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { name, email },
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------------------
// 3. PUT /api/user/change-password
// ----------------------------
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------------------
// 4. Upload avatar image
// ----------------------------

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user,
      { avatar: avatarPath },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Avatar updated",
      avatar: avatarPath,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------------------
// 5. Delete Account
// ----------------------------

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user;
    const { password } = req.body;

    if (!password)
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });

    // Delete user
    await User.findByIdAndDelete(userId);
    await SearchLog.deleteMany({ userId });

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ----------------------------
// 6. GET /api/user/request-email-change
// ----------------------------

export const requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const userId = req.user;
    // Validate format
    if (!validateEmail(newEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if inbox exists
    const alExists = await checkEmailExists(newEmail);
    if (!alExists) {
      return res
        .status(400)
        .json({ message: "This email address does not exist." });
    }

    const exists = await User.findOne({ email: newEmail });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });

    const token = crypto.randomBytes(20).toString("hex");
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findByIdAndUpdate(
      userId,
      {
        pendingEmail: newEmail,
        emailChangeToken: hashed,
        emailChangeExpires: Date.now() + 15 * 60 * 1000,
      },
      { new: true }
    );

    const verifyURL = `http://localhost:5173/confirm-email-change/${token}`;

    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      to: newEmail,
      subject: "Confirm your new email",
      html: `
        <h2>Confirm your new email</h2>
        <p>Click below to update your email address:</p>
        <a href="${verifyURL}">${verifyURL}</a>
        <p>Valid for 15 minutes.</p>
      `,
    });

    res.json({ success: true, message: "Verification link sent to new email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ----------------------------
// 7. GET /api/user/confirm-email-change:token
// ----------------------------
export const confirmEmailChange = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailChangeToken: hashedToken,
      emailChangeExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });

    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.emailChangeToken = undefined;
    user.emailChangeExpires = undefined;

    await user.save();

    res.json({ success: true, message: "Email updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
