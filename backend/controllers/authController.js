import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
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

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Email format validation
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 2️⃣ Check if email exists on the internet
    const emailExists = await checkEmailExists(email);
    if (!emailExists) {
      return res.status(400).json({
        message: "Email address does not exist. Please use a valid email.",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash user password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate Email Verification Token
    const verifyToken = crypto.randomBytes(20).toString("hex");
    const hashedVerifyToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    // Create user with verification token
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verified: false,
      verifyToken: hashedVerifyToken,
      verifyTokenExpires: Date.now() + 15 * 60 * 1000, // 15 mins
    });

    // Create URL sent in email
    const verifyURL = `http://localhost:5173/verify-email/${verifyToken}`;

    // Nodemailer transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: "Flight Fare Optimizer <noreply@ffo.com>",
      to: user.email,
      subject: "Verify Your Email",
      html: `
        <h2>Welcome, ${user.name}!</h2>
        <p>Please verify your email to activate your account.</p>
        <a href="${verifyURL}" style="color: blue;">Verify Email</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful. Verify your email to continue.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❗ Block login if email not verified
    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null, 
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 1️⃣ Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Save token to DB (hashed)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    // EMAIL sending (basic)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // your google app password
      },
    });

    await transporter.sendMail({
      from: "Flight Fare Optimizer <noreply@ffo.com>",
      to: user.email,
      subject: "Password Reset Link",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetURL}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.json({ success: true, message: "Reset link sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 2️⃣ Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find matching token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);

    // Clear token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token + not expired
    const user = await User.findOne({
      verifyToken: hashedToken,
      verifyTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    // Make user verified
    user.verified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.verified)
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });

    // Generate new token
    const verifyToken = crypto.randomBytes(20).toString("hex");
    const hashedVerifyToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    user.verifyToken = hashedVerifyToken;
    user.verifyTokenExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const verifyURL = `http://localhost:5173/verify-email/${verifyToken}`;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: "Flight Fare Optimizer <noreply@ffo.com>",
      to: user.email,
      subject: "Resend Email Verification",
      html: `
        <h3>Verify Your Email</h3>
        <p>Click the link below:</p>
        <a href="${verifyURL}">${verifyURL}</a>
      `,
    });

    res.json({ success: true, message: "Verification email re-sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
