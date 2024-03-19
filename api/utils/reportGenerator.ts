import { schedule } from "node-cron";
import enrollmentsRepository from "../repositories/enrollments.repository.js";
import usersRepository from "../repositories/users.repository.js";
import adminReportsRepository from "../repositories/adminReports.repository.js";
import mongoose from "mongoose";
import coursesRepository from "../repositories/courses.repository.js";
import reviewsRepository from "../repositories/reviews.repository.js";
import tutorReportsRepository from "../repositories/tutorReports.repository.js";
function weekFilter() {
  const currentDate = new Date();
  const firstDayOfCurrentWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay()
  );
  const firstDayOfPreviousWeek = new Date(firstDayOfCurrentWeek);
  firstDayOfPreviousWeek.setDate(firstDayOfPreviousWeek.getDate() - 7);
  const lastDayOfPreviousWeek = new Date(firstDayOfCurrentWeek);
  lastDayOfPreviousWeek.setDate(lastDayOfPreviousWeek.getDate() - 1);
  return [firstDayOfPreviousWeek, lastDayOfPreviousWeek];
}

function monthFilter() {
  const currentDate = new Date();
  const firstDayOfPreviousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  const lastDayOfPreviousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  );
  return [firstDayOfPreviousMonth, lastDayOfPreviousMonth];
}

function yearFilter() {
  const currentDate = new Date();
  const firstDayOfPreviousYear = new Date(currentDate.getFullYear() - 1, 0, 1);
  const lastDayOfPreviousYear = new Date(currentDate.getFullYear(), 0, 0);
  return [firstDayOfPreviousYear, lastDayOfPreviousYear];
}

async function generateAdminReport(type: "weekly" | "monthly" | "yearly") {
  try {
    let start: Date, end: Date;
    switch (type) {
      case "weekly":
        [start, end] = weekFilter();
        break;
      case "monthly":
        [start, end] = monthFilter();
        break;
      case "yearly":
        [start, end] = yearFilter();
        break;
    }
    const dateFilter = {
      createdAt: {
        $gte: start,
        $lte: end,
      },
    };
    const usersCountQuery = usersRepository.count(dateFilter);
    const enrollmentsCountQuery = enrollmentsRepository.count(dateFilter);
    const revenuePipeline = [
      {
        $match: dateFilter,
      },

      {
        $group: {
          _id: null,
          revenue: { $sum: "$price" },
        },
      },
    ];
    const categoryPipeline = [
      {
        $match: dateFilter,
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $lookup: {
          from: "categories",
          localField: "course.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
      {
        $group: {
          _id: "$categoryDetails.name",
          name: { $first: "$categoryDetails.name" },
          count: { $sum: 1 },
        },
      },
    ];
    const categoryAggregation = await enrollmentsRepository.aggregate(
      categoryPipeline
    );

    const coursePipeline = [
      {
        $match: dateFilter,
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $group: {
          _id: "$course._id",
          name: { $first: "$course.title" },
          count: { $sum: 1 },
        },
      },
    ];
    const courseAggregation = enrollmentsRepository.aggregate(coursePipeline);
    const revenueQuery = enrollmentsRepository.aggregate(revenuePipeline);
    const [
      usersCount,
      enrollmentsCount,
      revenueDoc,
      categoryAggregate,
      courseAggregate,
    ] = await Promise.all([
      usersCountQuery,
      enrollmentsCountQuery,
      revenueQuery,
      categoryAggregation,
      courseAggregation,
    ]);
    const enrollmentsByCategory = categoryAggregate.map((category) => {
      return {
        name: category.name as string,
        count: category.count as number,
      };
    });
    const enrollmentsByCourse = courseAggregate.map((course) => {
      return {
        name: course.name as string,
        count: course.count as number,
      };
    });
    const revenue = revenueDoc[0]?.revenue || 0;
    const earnings = (revenue / 100) * 20;
    await adminReportsRepository.create({
      type,
      usersCount,
      enrollmentsCount,
      revenue,
      earnings,
      enrollmentsByCategory,
      enrollmentsByCourse,
      startDate: start,
      endDate: end,
    });
  } catch (error) {
    console.log(error);
  }
}
async function generateTutorReport(
  type: "weekly" | "monthly" | "yearly",
  tutorId: string | mongoose.Types.ObjectId
) {
  try {
    let start: Date, end: Date;
    switch (type) {
      case "weekly":
        [start, end] = weekFilter();
        break;
      case "monthly":
        [start, end] = monthFilter();
        break;
      case "yearly":
        [start, end] = yearFilter();
        break;
    }
    let filter: any = {
      createdAt: {
        $gte: start,
        $lte: end,
      },
    };
    const courses = await coursesRepository.find({ tutor: tutorId });
    const courseIds = courses.map((course) => course._id);
    filter = { ...filter, course: { $in: courseIds } };
    const coursePipeline = [
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $group: {
          _id: "$course._id",
          name: { $first: "$course.title" },
          count: { $sum: 1 },
        },
      },
    ];
    const courseAggregation = enrollmentsRepository.aggregate(coursePipeline);
    const enrollmentsCountQuery = enrollmentsRepository.count(filter);

    const reviewAggregation = reviewsRepository.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: null,
          average: { $avg: "$rating" },
        },
      },
    ]);
    const revenuePipeline = [
      {
        $match: filter,
      },

      {
        $group: {
          _id: null,
          revenue: { $sum: "$price" },
        },
      },
    ];
    const revenueQuery = enrollmentsRepository.aggregate(revenuePipeline);
    const [ratingDoc, enrollmentsCount, revenueDoc, courseDoc] =
      await Promise.all([
        reviewAggregation,
        enrollmentsCountQuery,
        revenueQuery,
        courseAggregation,
      ]);
    const enrollmentsByCourse = courseDoc.map((course) => {
      return {
        name: course.name as string,
        count: course.count as number,
      };
    });
    const averageRating = ratingDoc[0]?.average || 0;
    const revenue = revenueDoc[0]?.revenue || 0;
    const earnings = (revenue / 100) * 80;

    await tutorReportsRepository.create({
      tutor: tutorId,
      type,
      averageRating,
      enrollmentsCount,
      enrollmentsByCourse,
      revenue,
      earnings,
      startDate: start,
      endDate: end,
    });
  } catch (error) {
    console.log(error);
  }
}

const scheduleReportGeneration = () => {
  schedule("0 0 * * 0", async () => {
    generateAdminReport("weekly");
    const courses = await coursesRepository.aggregate([
      {
        $group: {
          _id: "$tutor",
        },
      },
    ]);
    courses.forEach(async (course) => {
      generateTutorReport("weekly", course._id);
    });
  });

  schedule("0 0 1 * *", async () => {
    generateAdminReport("monthly");
    const courses = await coursesRepository.aggregate([
      {
        $group: {
          _id: "$tutor",
        },
      },
    ]);
    courses.forEach(async (course) => {
      generateTutorReport("monthly", course._id);
    });
  });

  schedule("0 0 1 1 *", async () => {
    generateAdminReport("yearly");
    const courses = await coursesRepository.aggregate([
      {
        $group: {
          _id: "$tutor",
        },
      },
    ]);
    courses.forEach(async (course) => {
      generateTutorReport("yearly", course._id);
    });
  });
};

export const testGeneration = async () => {
  try {
    // generateAdminReport("monthly");
    const tutors = await coursesRepository.aggregate([
      {
        $group: {
          _id: "$tutor",
        },
      },
    ]);
    tutors.forEach(async (tutor) => {
      generateTutorReport("monthly", tutor._id);
    });
  } catch (error) {
    console.log(error);
  }
};
export default scheduleReportGeneration;
