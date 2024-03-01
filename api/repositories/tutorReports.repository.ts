import mongoose, { QueryOptions } from "mongoose";
import tutorReportsModel from "../models/tutorReports.model.js";

export class TutorReportsRepository {
  private model = tutorReportsModel;

  async create(data: {
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
  }) {
    try {
      return await this.model.create(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async find(filter: object, options?: QueryOptions) {
    try {
      return await this.model.find(filter);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async findOne(filter: object, options?: QueryOptions) {
    try {
      return await this.model.findOne(filter, {}, options);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new TutorReportsRepository();
