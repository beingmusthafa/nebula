import mongoose, {
  ObjectId,
  ObtainSchemaGeneric,
  QueryOptions,
} from "mongoose";
import exercisesModel from "../models/exercises.model.js";
import IExercises from "../interfaces/exercises.interface.js";
export class ExercisesRepository {
  private model = exercisesModel;
  async delete(query: {
    _id?: string | mongoose.Types.ObjectId;
    course?: string | mongoose.Types.ObjectId;
    chapter?: string | mongoose.Types.ObjectId;
  }) {
    await this.model.deleteMany(query);
  }

  async deleteOne(query: { _id?: string | mongoose.Types.ObjectId }) {
    try {
      const doc = await this.model.findOneAndDelete(query);
      return doc;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async find(
    filter: {
      chapter?: string | mongoose.Types.ObjectId;
      course?: string | mongoose.Types.ObjectId;
    },
    options?: QueryOptions
  ) {
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

  async findOne(query: object) {
    try {
      return await this.model.findOne(query);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateOne(filter: object, updation: object) {
    try {
      const doc = await this.model.findOneAndUpdate(filter, updation, {
        new: true,
      });
      return doc;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(data: IExercises) {
    try {
      const doc = await this.model.create(data);
      if (doc) {
        return doc.toObject();
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async count(filter?: {
    course?: string | mongoose.Types.ObjectId;
    chapter?: string | mongoose.Types.ObjectId;
  }) {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new ExercisesRepository();
