import mongoose from "mongoose";

const Otps = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    code: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Otps", Otps);
