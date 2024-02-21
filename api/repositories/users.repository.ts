import mongoose from "mongoose";
import QueryOptionsInterface from "../interfaces/queryOptions.interface.js";
import UsersInterface from "../interfaces/users.interface.js";
import usersModel from "../models/users.model.js";

export class UsersRepository {
  private model = usersModel;
  async find(queryFilter: object = {}, options?: QueryOptionsInterface) {
    try {
      let query = this.model.find(queryFilter);
      if (options.select) {
        query = query.select(options.select);
      }

      if (options.sort) {
        query = query.sort(options.sort);
      }

      if (options.populate) {
        query = query.populate(options.populate);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.skip) {
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

  async findById(
    id: string | mongoose.Types.ObjectId,
    select?: string | Record<string, 1 | 0>
  ) {
    try {
      let query = this.model.findById(id);
      if (select) {
        query = query.select(select);
      }
      return query.exec();
    } catch (error) {
      throw error;
    }
  }
  async findByEmail(email: string) {
    try {
      const doc = await this.model.findOne({ email });
      if (doc) return doc.toObject();
      return null;
    } catch (error) {
      throw error;
    }
  }

  async updateOne(query: object, updation: object) {
    try {
      const doc = await this.model.findOneAndUpdate(query, updation, {
        new: true,
      });
      if (doc) return doc.toObject();
      return null;
    } catch (error) {
      throw error;
    }
  }

  async create(user: UsersInterface) {
    try {
      const doc = await this.model.create(user);
      return doc.toObject();
    } catch (error) {
      throw error;
    }
  }
}

export default new UsersRepository();
