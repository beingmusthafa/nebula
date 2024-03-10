import mongoose from "mongoose";
import cartsRepositoryInstance, {
  CartsRepository,
} from "../repositories/carts.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import ICourses from "../interfaces/courses.interface.js";
import enrollmentsRepositoryInstance, {
  EnrollmentsRepository,
} from "../repositories/enrollments.repository.js";
import coursesRepositoryInstance, {
  CoursesRepository,
} from "../repositories/courses.repository.js";
import ICartsService from "../interfaces/service.interfaces/carts.service.interface.js";

interface User {
  prototype?: mongoose.Types.ObjectId;
  cacheHexString?: unknown;
  generate?: {};
  createFromTime?: {};
  createFromHexString?: {};
  createFromBase64?: {};
  isValid?: {};
}
interface Cart {
  user: User;
  course: {
    prototype?: mongoose.Types.ObjectId;
    cacheHexString?: unknown;
    generate?: {};
    createFromTime?: {};
    createFromHexString?: {};
    createFromBase64?: {};
    isValid?: {};
    title?: string;
    thumbnail?: string;
    price?: number;
    discount?: number;
  };
}

export class CartsService implements ICartsService {
  private cartsRepository: CartsRepository;
  private coursesRepository: CoursesRepository;
  private enrollmentsRepository: EnrollmentsRepository;

  constructor(
    cartsRepository: CartsRepository,
    enrollmentsRepository: EnrollmentsRepository,
    coursesRepository: CoursesRepository
  ) {
    this.cartsRepository = cartsRepository;

    this.enrollmentsRepository = enrollmentsRepository;
    this.coursesRepository = coursesRepository;
  }

  private async isActionValid(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ) {
    try {
      const isOwnCourse = this.coursesRepository.findOne({
        tutor: userId,
        _id: courseId,
      });
      const alreadyPurchased = this.enrollmentsRepository.findOne({
        user: userId,
        course: courseId,
      });
      const courseisPublished = this.coursesRepository.findOne({
        _id: courseId,
        status: "published",
      });
      const result = await Promise.all([
        isOwnCourse,
        alreadyPurchased,
        courseisPublished,
      ]);
      if (result[0] || result[1] || !result[2]) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCount(
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ count: number }> {
    try {
      const count = await this.cartsRepository.count({ user: userId });
      return {
        success: true,
        message: "fetched count successfully",
        statusCode: 200,
        count,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCart(userId: string | mongoose.Types.ObjectId): ServiceResponse<{
    docs?: ICourses[];
    bill?: { totalPrice: number; totalDiscount: number; finalTotal: number };
  }> {
    try {
      const result = await this.cartsRepository.find(
        { user: userId },
        {
          populate: [
            { path: "course" },
            { path: "course.tutor", select: "name image" },
          ],
          projection: "course",
        }
      );
      const docs = result.map((wishlist) => wishlist.course) as ICourses[];
      let totalPrice = 0,
        totalDiscount = 0,
        finalTotal = 0;
      docs.forEach((doc) => {
        totalPrice += doc?.price;
        totalDiscount += doc?.discount;
      });
      finalTotal = totalPrice - totalDiscount;
      return {
        success: true,
        message: "fetched carts succesfully",
        statusCode: 200,
        docs,
        bill: { totalPrice, totalDiscount, finalTotal },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addtoCart(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
      const isActionValid = await this.isActionValid(userId, courseId);
      if (!isActionValid) {
        return { success: false, message: "Invalid action", statusCode: 400 };
      }
      const cartExists = await this.cartsRepository.findOne({
        user: userId,
        course: courseId,
      });
      if (cartExists) {
        return { success: true, message: "Already in cart", statusCode: 200 };
      }
      await this.cartsRepository.create({ user: userId, course: courseId });
      return { success: true, message: "Added to cart", statusCode: 200 };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async removeFromCart(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
      await this.cartsRepository.deleteOne({ user: userId, course: courseId });
      return { success: true, message: "Removed from cart", statusCode: 200 };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async checkCart(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ) {
    try {
      const cartExists = await this.cartsRepository.findOne({
        user: userId,
        course: courseId,
      });
      return { inCart: cartExists ? true : false };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
export default new CartsService(
  cartsRepositoryInstance,
  enrollmentsRepositoryInstance,
  coursesRepositoryInstance
);
