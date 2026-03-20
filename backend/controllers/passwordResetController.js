import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendPasswordResetEmail } from "../utils/sendEmail.js";

// ── REQUEST RESET ──────────────────────────────────────────────
// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // always return success even if user not found (security best practice)
    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // hash and save to user
    user.resetPasswordToken   = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // build reset link
    const FRONTEND_URL = process.env.FRONTEND_URL || "https://collegematch.zestsketchpad.in";
    const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;

    // send email
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Something went wrong. Try again." });
  }
};

// ── RESET PASSWORD ─────────────────────────────────────────────
// POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // hash the incoming token and find matching user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken:   hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // not expired
    });

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired. Please request a new one.",
      });
    }

    // update password
    const salt = await bcrypt.genSalt(10);
    user.password             = await bcrypt.hash(password, salt);
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Something went wrong. Try again." });
  }
};