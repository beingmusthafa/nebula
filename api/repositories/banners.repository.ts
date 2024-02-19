import mongoose, { QueryOptions } from "mongoose";
import bannersModel from "../models/banners.model.js";
export class BannersRepository {
  private model = bannersModel;

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
      throw error;
    }
  }

  async findOne(_id: string | mongoose.Types.ObjectId) {
    try {
      return await this.model.findOne({ _id });
    } catch (error) {
      throw error;
    }
  }

  async create(data: { image: string; link: string; imagePublicId: string }) {
    try {
      await this.model.create(data);
    } catch (error) {
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
      throw error;
    }
  }

  async updateOne(
    _id: string | mongoose.Types.ObjectId,
    data: { image?: string; link?: string; isActive?: boolean }
  ) {
    try {
      await this.model.updateOne({ _id }, data);
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(_id: string | mongoose.Types.ObjectId) {
    try {
      await this.model.deleteOne({ _id });
    } catch (error) {
      throw error;
    }
  }
}

export default new BannersRepository();
