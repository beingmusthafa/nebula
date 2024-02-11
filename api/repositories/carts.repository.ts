import mongoose, { mongo } from "mongoose";
import cartsModel from "../models/carts.model.js";
export class CartsRepository {
  private model = cartsModel;
  async delete(query: {
    _id?: string | mongoose.Types.ObjectId;
    courseId?: string | mongoose.Types.ObjectId;
    userId?: string | mongoose.Types.ObjectId;
  }) {
    await this.model.deleteMany(query);
  }

  async deleteOne(query: {
    _id?: string | mongoose.Types.ObjectId;
    courseId?: string | mongoose.Types.ObjectId;
    userId?: string | mongoose.Types.ObjectId;
  }) {
    await this.model.deleteOne(query);
  }

  async find(query: { userId: string | mongoose.Types.ObjectId }) {
    try {
      return await this.model.find(query);
    } catch (error) {
      throw error;
    }
  }

  async findOne(query: {
    courseId: string | mongoose.Types.ObjectId;
    userId: string | mongoose.Types.ObjectId;
  }) {
    try {
      return await this.model.findOne(query);
    } catch (error) {
      throw error;
    }
  }

  async create(data: {
    courseId: string | mongoose.Types.ObjectId;
    userId: string | mongoose.Types.ObjectId;
  }) {
    try {
      const cartExists = await this.model.findOne(data);
      if (cartExists) return;
      await this.model.create(data);
    } catch (error) {
      throw error;
    }
  }
}

export default new CartsRepository();
