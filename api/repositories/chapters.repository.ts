import mongoose, { QueryOptions } from "mongoose";
import chaptersModel from "../models/chapters.model.js";
import IChapters from "../interfaces/chapters.interface.js";
export class ChaptersRepository {
  private model = chaptersModel;

  async delete(query: {
    course?: string | mongoose.Types.ObjectId;
    _id?: string | mongoose.Types.ObjectId;
  }) {
    await this.model.deleteMany(query);
  }

  async deleteOne(id: string | mongoose.Types.ObjectId) {
    try {
      return await this.model.findOneAndDelete({ _id: id });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async find(
    filter: { course?: string | mongoose.Types.ObjectId },
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

      return await query.lean().exec();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(filter: object) {
    try {
      return await this.model.findOne(filter);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(data: IChapters) {
    try {
      await this.model.create(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async count(query?: object) {
    try {
      return await this.model.countDocuments(query);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(filter: object, updation: object) {
    try {
      return await this.model.updateMany(filter, updation);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async updateOne(filter: object, updation: object) {
    try {
      return await this.model.updateOne(filter, updation);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new ChaptersRepository();
