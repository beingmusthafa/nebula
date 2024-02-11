import mongoose from "mongoose";
import { CartsRepository } from "../repositories/carts.repository.js";
import { WishlistsRepository } from "../repositories/wishlists.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";

export default class CartsService {
  private cartsRepository: CartsRepository;
  constructor() {
    this.cartsRepository = new CartsRepository();
  }

  async addtoCart(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
      const cartExists = await this.cartsRepository.findOne({
        userId,
        courseId,
      });
      if (cartExists) {
        return { success: true, message: "Already in cart", statusCode: 200 };
      }
      await this.cartsRepository.create({ userId, courseId });
      return { success: true, message: "Added to cart", statusCode: 200 };
    } catch (error) {
      throw error;
    }
  }

  async removeFromCart(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
      await this.cartsRepository.deleteOne({ userId, courseId });
      return { success: true, message: "Removed from cart", statusCode: 200 };
    } catch (error) {
      throw error;
    }
  }

  async checkCart(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ) {
    try {
      const cartExists = await this.cartsRepository.findOne({
        userId,
        courseId,
      });
      return { inCart: cartExists ? true : false };
    } catch (error) {
      throw error;
    }
  }
}
