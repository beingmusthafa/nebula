import mongoose from "mongoose";

const cartsModel = new mongoose.Schema({
  course: {
    type: mongoose.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

export default mongoose.model("Carts", cartsModel);
