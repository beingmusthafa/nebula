import mongoose from "mongoose";

const videosModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  chapter: {
    type: mongoose.Types.ObjectId,
    ref: "Chapters",
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  videoPublicId: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Videos", videosModel);
