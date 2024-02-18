import mongoose, { QueryOptions, mongo } from "mongoose";
import purchasesModel from "../models/purchases.model.js";
export class PurchasesRepository {
  private model = purchasesModel;

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

  async findOne(query: {
    course?: string | mongoose.Types.ObjectId;
    user?: string | mongoose.Types.ObjectId;
  }) {
    try {
      return await this.model.findOne(query);
    } catch (error) {
      throw error;
    }
  }

  async create(data: {
    course: string | mongoose.Types.ObjectId;
    user: string | mongoose.Types.ObjectId;
    price: number;
  }) {
    try {
      const docExists = await this.model.findOne({
        course: data.course,
        user: data.user,
      });
      if (docExists) throw new Error("Purchase already made!");
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
}

export default new PurchasesRepository();
