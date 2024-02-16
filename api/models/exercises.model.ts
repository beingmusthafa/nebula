import mongoose from "mongoose";

const exercisesModel = new mongoose.Schema({
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
  order: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  answer: {
    type: String,
    required: true,
    enum: ["A", "B", "C", "D"],
  },
});

export default mongoose.model("Exercises", exercisesModel);
