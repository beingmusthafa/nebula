import mongoose from "mongoose";
import { WishlistsRepository } from "../repositories/wishlists.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
export default class WishlistsService {
  private wishlistsRepository: WishlistsRepository;
  constructor() {
    this.wishlistsRepository = new WishlistsRepository();
  }

  async getWishlist(
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ docs?: object[] }> {
    try {
      const result = await this.wishlistsRepository.find(
        { user: userId },
        {
          populate: [
            { path: "course" },
            { path: "course.tutor", select: "name image" },
          ],
          projection: "course",
        }
      );
      const docs = result.map((wishlist) => wishlist.course);
      return {
        success: true,
        message: "fetched wishlist successfully",
        statusCode: 200,
        docs,
      };
    } catch (error) {
      throw error;
    }
  }

  async addToWishlist(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
      const wishlistExists = await this.wishlistsRepository.findOne({
        user: userId,
        course: courseId,
      });
      if (wishlistExists) {
        return {
          success: true,
          message: "Already in wishlist",
          statusCode: 200,
        };
      }
      await this.wishlistsRepository.create({
        user: userId,
        course: courseId,
      });
      return { success: true, message: "Added to wishlist", statusCode: 200 };
    } catch (error) {
      throw error;
    }
  }

  async removeFromWishlist(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
      await this.wishlistsRepository.deleteOne({
        user: userId,
        course: courseId,
      });
      return {
        success: true,
        message: "Removed from wishlist",
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  async checkWishlist(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ) {
    try {
      const wishlistExists = await this.wishlistsRepository.findOne({
        user: userId,
        course: courseId,
      });
      return { inWishlist: wishlistExists ? true : false };
    } catch (error) {
      throw error;
    }
  }
}
