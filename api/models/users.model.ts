import mongoose from "mongoose";

const Users = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dfezowkdc/image/upload/v1706635565/avatar-1577909_1280_g4cn4e.webp",
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "moderator"],
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  appointmentCost: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Users", Users);
