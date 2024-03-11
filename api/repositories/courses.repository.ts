import mongoose, { PopulateOptions, QueryOptions } from "mongoose";
import QueryOptionsInterface from "../interfaces/queryOptions.interface.js";
import CoursesInterface from "../interfaces/courses.interface.js";
import coursesModel from "../models/courses.model.js";
import ICourses from "../interfaces/courses.interface.js";
import ICoursesRepository from "../interfaces/repository.interfaces/courses.repository.interface.js";
export class CoursesRepository implements ICoursesRepository {
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
      console.log(error);
      throw error;
    }
  }

  async count(query: object = {}) {
    try {
      return this.model.countDocuments(query).exec();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findById(id: string | mongoose.Types.ObjectId, options?: QueryOptions) {
    try {
      let query = this.model.findById(id);
      if (options?.projection) {
        query = query.select(options.projection);
      }
      if (options?.populate) {
        query = query.populate(options.populate as string | string[]);
      }
      return await query.lean().exec();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(filter: object, options?: QueryOptions) {
    try {
      let query = this.model.findOne(filter);
      if (options?.projection) {
        query = query.select(options.projection);
      }
      if (options?.populate) {
        query = query.populate(options.populate as string | string[]);
      }
      return await query.lean().exec();
    } catch (error) {
      console.log(error);
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
      console.log(error);
      throw error;
    }
  }

  async updateMany(query: object, updation: object) {
    try {
      const doc = await this.model.updateMany(query, { $set: updation });
      return doc.modifiedCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateOne(query: object, updation: object) {
    try {
      const doc = await this.model.updateOne(query, { $set: updation });
      return doc.modifiedCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(course: ICourses) {
    try {
      const doc = await this.model.create(course);
      return doc.toObject();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteOne(query: object) {
    try {
      const doc = await this.model.deleteOne(query);
      return doc.deletedCount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteMany(query: object) {
    try {
      const doc = await this.model.deleteMany(query);
      return doc.deletedCount;
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

export default new CoursesRepository();
