import mongoose from "mongoose";

const messagesModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Courses",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Messages", messagesModel);
