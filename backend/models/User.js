import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },

    // saved colleges as name strings
    savedColleges: {
      type: [String],
      default: [],
    },

    // user preferences
    preferredCity: {
      type: String,
      default: "",
    },
    preferredCourse: {
      type: String,
      default: "",
    },
    budgetRange: {
      type: Number,
      default: 0,
    },

    // ── password reset fields ──
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);