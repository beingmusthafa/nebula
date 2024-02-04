import mongoose from "mongoose";

const coursesModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  requirements: {
    type: [String],
    default: [],
  },
  benefits: {
    type: [String],
    default: [],
  },
  offers: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        default: [],
      },
    ],
    default: [],
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Courses", coursesModel);
