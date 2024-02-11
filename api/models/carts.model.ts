import mongoose from "mongoose";

const cartsModel = new mongoose.Schema({
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

export default mongoose.model("Carts", cartsModel);
