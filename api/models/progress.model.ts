import mongoose from "mongoose";

const progressModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  videos: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Videos",
    default: [],
  },
  exercises: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Exercises",
    default: [],
  },
  target: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Progress", progressModel);
