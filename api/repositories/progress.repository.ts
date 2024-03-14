import mongoose, { QueryOptions } from "mongoose";
import progressModel from "../models/progress.model.js";
import IProgressRepository from "../interfaces/repository.interfaces/progress.repository.interface.js";

export class ProgressRepository implements IProgressRepository {
  private model = progressModel;

  async createMany(
    data: {
      user: string | mongoose.Types.ObjectId;
      course: string | mongoose.Types.ObjectId;
      target: number;
    }[]
  ) {
    try {
      const review = await this.model.insertMany(data);
      return review;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async pushToField(
    filter: object,
    field: "videos" | "exercises",
    value: string | mongoose.Types.ObjectId
  ) {
    try {
      const doc = await this.model.updateOne(filter, {
        $addToSet: { [field]: value },
      });
      return doc.modifiedCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async pullFromField(
    filter: object,
    field: "videos" | "exercises",
    value: string | mongoose.Types.ObjectId
  ) {
    try {
      const doc = await this.model.updateOne(filter, {
        $pull: { [field]: value },
      });
      return doc.modifiedCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

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

      return query.exec();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(filter: object, options?: QueryOptions) {
    try {
      let query = this.model.findOne(filter);
      if (options?.select) {
        query = query.select(options.select);
      }

      if (options?.populate) {
        query = query.populate(options.populate as string | string[]);
      }

      return query.exec();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteOne(filter: object) {
    try {
      const doc = await this.model.deleteOne(filter);
      return doc.deletedCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteMany(filter: object) {
    try {
      const doc = await this.model.deleteMany(filter);
      return doc.deletedCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new ProgressRepository();
