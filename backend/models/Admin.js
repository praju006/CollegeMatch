import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true }, // bcrypt hash
  role:     { type: String, enum: ["super", "college"], required: true, default: "college" },
  college:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: function () { return this.role === "college"; },
  },
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);
