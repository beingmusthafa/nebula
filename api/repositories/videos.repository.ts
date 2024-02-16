import mongoose, { QueryOptions } from "mongoose";
import videosModel from "../models/videos.model.js";
import IVideos from "../interfaces/videos.interface.js";

export class VideosRepository {
  private model = videosModel;
  async delete(query: {
    course?: string | mongoose.Types.ObjectId;
    chapter?: string | mongoose.Types.ObjectId;
  }) {
    await this.model.deleteMany(query);
  }

  async deleteOne(query: {
    _id?: string | mongoose.Types.ObjectId;
    course?: string | mongoose.Types.ObjectId;
    chapter?: string | mongoose.Types.ObjectId;
  }) {
    await this.model.deleteOne(query);
  }

  async find(
    filter?: {
      course?: string | mongoose.Types.ObjectId;
      chapter?: string | mongoose.Types.ObjectId;
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
      throw error;
    }
  }

  async findOne(query: { _id: string | mongoose.Types.ObjectId }) {
    try {
      return await this.model.findOne(query);
    } catch (error) {
      throw error;
    }
  }

  async create(data: IVideos) {
    try {
      const docExists = await this.model.findOne(data);
      if (docExists) return;
      await this.model.create(data);
    } catch (error) {
      throw error;
    }
  }

  async count(query?: IVideos) {
    try {
      return await this.model.countDocuments(query);
    } catch (error) {
      throw error;
    }
  }
}

export default new VideosRepository();
