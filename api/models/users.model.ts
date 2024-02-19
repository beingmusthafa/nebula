import mongoose from "mongoose";

const educationSubSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: true,
  },
});

const experienceSubSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
});

const Users = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dfezowkdc/image/upload/v1706951267/gray-photo-placeholder-icon-design-ui-vector-35850819_vupnvf.jpg",
    },
    imagePublicId: {
      type: String,
      default: "",
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
    interests: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Categories",
      default: [],
    },
    education: [educationSubSchema],
    experience: [experienceSubSchema],
    isAuthExternal: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Users", Users);
