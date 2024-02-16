import mongoose from "mongoose";

const chaptersModel = new mongoose.Schema({
  course: {
    type: mongoose.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  videos: {
    type: [mongoose.Types.ObjectId],
    ref: "Videos",
    default: [],
  },
  exercises: {
    type: [mongoose.Types.ObjectId],
    ref: "Exercises",
    default: [],
  },
});

export default mongoose.model("Chapters", chaptersModel);
