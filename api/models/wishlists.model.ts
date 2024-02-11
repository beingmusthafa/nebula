import mongoose from "mongoose";

const wishlistsModel = new mongoose.Schema({
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

export default mongoose.model("Wishlists", wishlistsModel);
