import { QueryOptions } from "mongoose";
import adminReportsModel from "../models/adminReports.model.js";
import IAdminReportsRepository from "../interfaces/repository.interfaces/adminReports.repository.interface.js";

export class AdminReportsRepository implements IAdminReportsRepository {
  private model = adminReportsModel;

  async create(data: {
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

export default new AdminReportsRepository();
