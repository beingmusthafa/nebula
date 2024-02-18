import mongoose, { ObjectId } from "mongoose";

const chaptersModel = new mongoose.Schema({
  course: {
    type: mongoose.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Chapters", chaptersModel);
