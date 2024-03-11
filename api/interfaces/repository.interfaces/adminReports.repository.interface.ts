import { QueryOptions } from "mongoose";

export default interface IAdminReportsRepository {
  create(data: {
    type: "weekly" | "monthly" | "yearly";
    usersCount: number;
    enrollmentsCount: number;
    revenue: number;
    earnings: number;
    enrollmentsByCategory: {
      name: string;
      count: number;
    }[];
    enrollmentsByCourse: {
      name: string;
      count: number;
    }[];
    startDate: Date;
    endDate: Date;
  });

  find(filter: object, options?: QueryOptions);

  findOne(filter: object, options?: QueryOptions);
}
