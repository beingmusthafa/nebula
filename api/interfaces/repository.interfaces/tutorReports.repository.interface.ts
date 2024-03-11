import mongoose, { QueryOptions } from "mongoose";

export default interface ITutorReportsRepository {
  create(data: {
    type: string;
    tutor: string | mongoose.Types.ObjectId;
    enrollmentsCount: number;
    enrollmentsByCourse: {
      name: string;
      count: number;
    }[];
    averageRating: number;
    revenue: number;
    earnings: number;
    startDate: Date;
    endDate: Date;
  });

  find(filter: object, options?: QueryOptions);

  findOne(filter: object, options?: QueryOptions);
}
