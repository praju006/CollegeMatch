import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    shortName: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      default: "Karnataka",
    },

    type: {
      type: String,
      enum: ["Government", "Private", "Deemed"],
      required: true,
    },

    ranking: {
      type: Number,
    },

    imageUrl: {
      type: String,
    },

    courses: [
      {
        name: String,
        duration: String,
        fees: Number,
        cutoffMarks: Number,
        seats: Number,
      },
    ],

    placement: {
      averagePackage: Number,
      highestPackage: Number,
      placementRate: Number,
      topRecruiters: [String],
    },

    approvedBy: [String], // AICTE, UGC, etc.
  },
  {
    timestamps: true,
  }
);

const College = mongoose.model("College", collegeSchema);
export default College;
