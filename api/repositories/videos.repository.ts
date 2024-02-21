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
    try {
      return await this.model.findOneAndDelete(query);
    } catch (error) {
      throw error;
    }
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

  async findOne(query: object) {
    try {
      return await this.model.findOne(query);
    } catch (error) {
      throw error;
    }
  }

  async create(data: IVideos) {
    try {
      const doc = await this.model.create(data);
      if (doc) return doc.toObject();
    } catch (error) {
      throw error;
    }
  }

  async count(query?: object) {
    try {
      return await this.model.countDocuments(query);
    } catch (error) {
      throw error;
    }
  }

  async updateMany(filter: object, updation: object) {
    try {
      return await this.model.updateMany(filter, updation);
    } catch (error) {
      throw error;
    }
  }

  async updateOne(filter: object, updation: object) {
    try {
      return await this.model.updateOne(filter, updation);
    } catch (error) {
      throw error;
    }
  }
}

export default new VideosRepository();
