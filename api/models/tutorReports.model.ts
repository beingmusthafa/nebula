import mongoose from "mongoose";

const tutorReportsModel = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    enrollmentsCount: {
      type: Number,
      required: true,
    },
    enrollmentsByCourse: {
      type: [
        {
          name: String,
          count: Number,
        },
      ],
      required: true,
    },
    averageRating: {
      type: Number,
      required: true,
    },
    revenue: {
      type: Number,
      required: true,
    },
    earnings: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TutorReports", tutorReportsModel);
