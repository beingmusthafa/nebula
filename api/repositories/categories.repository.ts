import mongoose, { PopulateOptions, QueryOptions } from "mongoose";
import QueryOptionsInterface from "../interfaces/queryOptions.interface.js";
import CategoriesInterface from "../interfaces/categories.interface.js";
import categoriesModel from "../models/categories.model.js";
export class CategoriesRepository {
  private model = categoriesModel;
  async find(queryFilter: object = {}, options?: QueryOptions) {
    try {
      let query = this.model.find(queryFilter);
      if (options?.select) {
        query = query.select(options.select);
      }

      if (options?.sort) {
        query = query.sort(options.sort);
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

  async create(category: CategoriesInterface) {
    try {
      const doc = await this.model.create(category);
      return doc.toObject();
    } catch (error) {
      throw error;
    }
  }
}

export default new CategoriesRepository();
