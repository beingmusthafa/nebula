import mongoose from "mongoose";

const categoriesModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Categories", categoriesModel);
