import mongoose, { QueryOptions } from "mongoose";
import chaptersModel from "../models/chapters.model.js";
import IChapters from "../interfaces/chapters.interface.js";
export class ChaptersRepository {
  private model = chaptersModel;

  async delete(query: {
    course?: string | mongoose.Types.ObjectId;
    _id: string | mongoose.Types.ObjectId;
  }) {
    await this.model.deleteMany(query);
  }

  async deleteOne(id: string | mongoose.Types.ObjectId) {
    await this.model.deleteOne({ _id: id });
  }

  async find(course: string | mongoose.Types.ObjectId, options?: QueryOptions) {
    try {
      let query = this.model.find({ course });
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
      throw error;
    }
  }

  async findOne(
    filter:
      | { _id: string | mongoose.Types.ObjectId }
      | { title: string }
      | { order: number }
  ) {
    try {
      return await this.model.findOne(filter);
    } catch (error) {
      throw error;
    }
  }

  async create(data: IChapters) {
    try {
      const docExists = await this.model.findOne(data);
      if (docExists) return;
      await this.model.create(data);
    } catch (error) {
      throw error;
    }
  }

  async count(query?: IChapters) {
    try {
      return await this.model.countDocuments(query);
    } catch (error) {
      throw error;
    }
  }
}

export default new ChaptersRepository();
