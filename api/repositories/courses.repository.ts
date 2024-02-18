import mongoose, { PopulateOptions, QueryOptions } from "mongoose";
import QueryOptionsInterface from "../interfaces/queryOptions.interface.js";
import CoursesInterface from "../interfaces/courses.interface.js";
import coursesModel from "../models/courses.model.js";
import ICourses from "../interfaces/courses.interface.js";
export class CoursesRepository {
  private model = coursesModel;
  async find(queryFilter: object = {}, options?: QueryOptions) {
    try {
      let query = this.model.find(queryFilter);
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

  async findById(id: string | mongoose.Types.ObjectId, options?: QueryOptions) {
    try {
      let query = this.model.findById(id);
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

      return (await query.exec()).toObject();
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

  async updateMany(query: object, updation: object) {
    try {
      const doc = await this.model.updateMany(query, { $set: updation });
      return doc.modifiedCount;
    } catch (error) {
      throw error;
    }
  }

  async create(course: ICourses) {
    try {
      const doc = await this.model.create(course);
      return doc.toObject();
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(query: object) {
    try {
      const doc = await this.model.deleteOne(query);
      return doc.deletedCount;
    } catch (error) {
      throw error;
    }
  }

  async deleteMany(query: object) {
    try {
      const doc = await this.model.deleteMany(query);
      return doc.deletedCount;
    } catch (error) {
      throw error;
    }
  }
}

export default new CoursesRepository();
