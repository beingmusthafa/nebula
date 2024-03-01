import mongoose from "mongoose";

const adminReportsModel = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },
    usersCount: {
      type: Number,
      required: true,
    },
    enrollmentsCount: {
      type: Number,
      required: true,
    },
    enrollmentsByCategory: {
      type: [
        {
          name: String,
          count: Number,
        },
      ],
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

export default mongoose.model("AdminReports", adminReportsModel);
