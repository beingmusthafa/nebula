import mongoose, { AggregateOptions, QueryOptions, mongo } from "mongoose";
import enrollmentsModel from "../models/enrollments.model.js";
export class EnrollmentsRepository {
  private model = enrollmentsModel;

  async find(filter: object, options?: QueryOptions) {
    try {
      let query = this.model.find(filter);
      if (options?.select) {
        query = query.select(options.select);
      }

      if (options?.sort) {
        query = query.sort(options.sort);
      }

      if (options?.populate) {
        query = query.populate(options.populate as string | string[]);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.skip) {
        query = query.skip(options.skip);
      }

      return await query.exec();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(query: {
    course?: string | mongoose.Types.ObjectId;
    user?: string | mongoose.Types.ObjectId;
  }) {
    try {
      return await this.model.findOne(query);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(data: {
    course: string | mongoose.Types.ObjectId;
    user: string | mongoose.Types.ObjectId;
    price: number;
  }) {
    try {
      const docExists = await this.model.findOne({
        course: data.course,
        user: data.user,
      });
      if (docExists) throw new Error("Purchase already made!");
      await this.model.create(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createMany(
    data: {
      course: string | mongoose.Types.ObjectId;
      user: string | mongoose.Types.ObjectId;
      price: number;
    }[]
  ) {
    try {
      await this.model.insertMany(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async count(filter: object) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async aggregate(pipeline: mongoose.PipelineStage[]) {
    try {
      return await this.model.aggregate(pipeline);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new EnrollmentsRepository();
