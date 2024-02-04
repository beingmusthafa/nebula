import mongoose from "mongoose";
import QueryOptionsInterface from "../interfaces/queryOptions.interface.js";
import CoursesInterface from "../interfaces/courses.interface.js";
import coursesModel from "../models/courses.model.js";
export class CoursesRepository {
  private model = coursesModel;
  async find(queryFilter: object = {}, options?: QueryOptionsInterface) {
    try {
      let query = this.model.find(queryFilter);
      if (options.select) {
        query = query.select(options.select);
      }

      if (options.sort) {
        query = query.sort(options.sort);
      }

      if (options.populate) {
        query = query.populate(options.populate);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.skip) {
        query = query.skip(options.skip);
      }

      return query.exec();
    } catch (error) {
      throw error;
    }
  }

  async count(query: object = {}) {
    try {
      return this.model.countDocuments(query).exec();
    } catch (error) {
      throw error;
    }
  }

  async findById(
    id: string | mongoose.Types.ObjectId,
    select?: string | Record<string, 1 | 0>
  ) {
    try {
      let query = this.model.findById(id);
      if (select) {
        query = query.select(select);
      }
      return query.exec();
    } catch (error) {
      throw error;
    }
  }

  async findOneAndUpdate(query: object, updation: object) {
    try {
      const doc = await this.model.findOneAndUpdate(
        query,
        { $set: updation },
        { new: true }
      );
      if (doc) return doc.toObject();
      return null;
    } catch (error) {
      throw error;
    }
  }

  async create(course: CoursesInterface) {
    try {
      const doc = await this.model.create(course);
      return doc.toObject();
    } catch (error) {
      throw error;
    }
  }
}

export default new CoursesRepository();
