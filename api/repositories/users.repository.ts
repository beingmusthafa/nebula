import QueryOptionsInterface from "../interfaces/queryOptions.interface.js";
import UsersInterface from "../interfaces/users.interface.js";
import usersModel from "../models/users.model.js";

export class UsersRepository {
  private model = usersModel;
  async findAll(query: object, options?: QueryOptionsInterface) {
    try {
      let query = this.model.find();
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

  async findById(id: string, select?: string | Record<string, 1 | -1>) {
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

  async create(user: UsersInterface) {
    try {
      console.log("repo");
      const doc = await this.model.create(user);
      return doc.toObject();
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      throw error;
    }
  }
}

export default new UsersRepository();
