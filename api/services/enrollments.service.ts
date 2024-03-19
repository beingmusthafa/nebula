import enrollmentsRepositoryInstance from "../repositories/enrollments.repository.js";
import cartsRepositoryInstance from "../repositories/carts.repository.js";
import wishlistRepositoryInstance from "../repositories/wishlists.repository.js";
import progressRepositoryInstance from "../repositories/progress.repository.js";
import progressServiceInstance from "./progress.service.js";
import DatabaseId from "../types/databaseId.type.js";

import ServiceResponse from "../types/serviceresponse.type.js";
import coursesRepositoryInstance from "../repositories/courses.repository.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import IEnrollmentsService from "../interfaces/service.interfaces/enrollments.service.interface.js";
import IEnrollmentsRepository from "../interfaces/repository.interfaces/enrollments.repository.interface.js";
import ICoursesRepository from "../interfaces/repository.interfaces/courses.repository.interface.js";
import ICartsRepository from "../interfaces/repository.interfaces/carts.repository.interface.js";
import IWishlistsRepository from "../interfaces/repository.interfaces/wishlists.repository.interface.js";
import IProgressRepository from "../interfaces/repository.interfaces/progress.repository.interface.js";
import IProgressService from "../interfaces/service.interfaces/progress.service.interface.js";
import mongoose from "mongoose";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_KEY);

export class EnrollmentsService implements IEnrollmentsService {
  private enrollmentsRepository: IEnrollmentsRepository;
  private coursesRepository: ICoursesRepository;
  private cartsRepository: ICartsRepository;
  private wishlistsRepository: IWishlistsRepository;
  private progressRepository: IProgressRepository;
  private progressService: IProgressService;
  constructor(
    enrollmentsRepossitory: IEnrollmentsRepository,
    coursesRepository: ICoursesRepository,
    cartsRepository: ICartsRepository,
    wishlistsRepository: IWishlistsRepository,
    progressRepository: IProgressRepository,
    progressService: IProgressService
  ) {
    this.enrollmentsRepository = enrollmentsRepossitory;
    this.coursesRepository = coursesRepository;
    this.cartsRepository = cartsRepository;
    this.wishlistsRepository = wishlistsRepository;
    this.progressRepository = progressRepository;
    this.progressService = progressService;
  }
  private async isActionValid(
    userId: string | DatabaseId,
    courseId: string | DatabaseId
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
      const result = await Promise.all([isOwnCourse, alreadyPurchased]);
      if (result[0] || result[1]) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createCheckoutSession(
    userId: string | DatabaseId
  ): ServiceResponse<{ sessionId?: string }> {
    try {
      const carts = (await this.cartsRepository.find(
        { user: userId },
        { populate: { path: "course", select: "title image price discount" } }
      )) as { course: any }[];
      for (const cart of carts) {
        const isActionValid = await this.isActionValid(userId, cart.course._id);
        if (!isActionValid) {
          throw new Error("Invalid action");
        }
      }
      if (carts.length === 0) {
        return { success: false, message: "Cart is empty", statusCode: 400 };
      }
      const lineItems = carts.map((cart) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: cart.course.title!,
              images: [cart.course.thumbnail],
            },
            unit_amount: (cart.course.price - cart.course.discount) * 100,
          },
          quantity: 1,
        };
      });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_BASE_URL}/payment-success`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/payment-failure`,
        payment_intent_data: {
          metadata: {
            userId: userId.toString(),
          },
        },
      });
      return {
        success: true,
        message: "Checkout session created",
        statusCode: 200,
        sessionId: session.id,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async confirmPurchase(eventHeader: string | string[], requestBody: string) {
    try {
      const event = stripe.webhooks.constructEvent(
        requestBody,
        eventHeader,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      let intent = null;
      if (event["type"] === "payment_intent.succeeded") {
        intent = event.data.object;
        const userId = intent.metadata.userId;
        if (intent.metadata.userId !== userId.toString()) {
          throw new Error("Unauthorized");
        }
        const carts = (await this.cartsRepository.find(
          { user: userId },
          { populate: { path: "course", select: "price discount" } }
        )) as { course: any }[];
        const purchases = carts.map((cart) => {
          return {
            user: userId,
            course: cart.course,
            price: cart.course.price - cart.course.discount,
          };
        });
        const courseIds = carts.map((cart) => cart.course._id as string);
        await this.enrollmentsRepository.createMany(purchases);
        await this.progressService.createMultipleCourseProgress(
          userId,
          courseIds
        );
        await this.cartsRepository.deleteMany({ user: userId });
        await this.wishlistsRepository.deleteMany({ user: userId });
        return;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getEnrollments(
    userId: string | DatabaseId
  ): ServiceResponse<{ enrollments: object[] }> {
    try {
      const enrollments = await this.enrollmentsRepository.find(
        {
          user: userId,
        },
        {
          sort: { createdAt: 1 },
          populate: {
            path: "course",
            select: "title thumbnail price discount",
          },
        }
      );
      return {
        success: true,
        message: "Enrollments fetched",
        statusCode: 200,
        enrollments,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getGraphData(
    tutorId?: string | DatabaseId
  ): ServiceResponse<{ courseEnrollmentData: object[] }> {
    try {
      const enrollmentsAggregate = await this.enrollmentsRepository.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "course",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $unwind: "$course",
        },
        {
          $match: tutorId
            ? { "course.tutor": new mongoose.Types.ObjectId(tutorId) }
            : {},
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
            revenue: { $sum: "$price" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
      const courseEnrollmentData = enrollmentsAggregate.map((enrollment) => {
        return {
          month: enrollment._id,
          count: enrollment.count,
          revenue: enrollment.revenue,
        };
      });
      return {
        success: true,
        message: "Graph data fetched",
        statusCode: 200,
        courseEnrollmentData,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getTopCourses(
    tutorId?: string | DatabaseId
  ): ServiceResponse<{ courses: object[] }> {
    try {
      const enrollmentsAggregate = await this.enrollmentsRepository.aggregate([
        {
          $lookup: {
            from: "courses",
            localField: "course",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $unwind: "$course",
        },
        {
          $match: tutorId
            ? { "course.tutor": new mongoose.Types.ObjectId(tutorId) }
            : {},
        },
        {
          $group: {
            _id: "$course._id",
            course: { $first: "$course" },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);
      const topCourses = enrollmentsAggregate.map((enrollment) => {
        return {
          data: enrollment.course,
          count: enrollment.count,
        };
      });
      return {
        success: true,
        message: "Top courses fetched",
        statusCode: 200,
        courses: topCourses,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new EnrollmentsService(
  enrollmentsRepositoryInstance,
  coursesRepositoryInstance,
  cartsRepositoryInstance,
  wishlistRepositoryInstance,
  progressRepositoryInstance,
  progressServiceInstance
);
