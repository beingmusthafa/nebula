import mongoose from "mongoose";
import cartsRepositoryInstance, {
  CartsRepository,
} from "../repositories/carts.repository.js";
import wishlistRepositoryInstance, {
  WishlistsRepository,
} from "../repositories/wishlists.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import ICourses from "../interfaces/courses.interface.js";
import Stripe from "stripe";
import purchasesRepositoryInstance, {
  PurchasesRepository,
} from "../repositories/purchases.repository.js";
import progressRepositoryInstance, {
  ProgressRepository,
} from "../repositories/progress.repository.js";
import coursesRepositoryInstance, {
  CoursesRepository,
} from "../repositories/courses.repository.js";
import progressServiceInstance, {
  ProgressService,
} from "./progress.service.js";
const stripe = new Stripe(process.env.STRIPE_KEY);

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

export class CartsService {
  private cartsRepository: CartsRepository;
  private coursesRepository: CoursesRepository;
  private purchasesRepository: PurchasesRepository;
  private progressRepository: ProgressRepository;
  private wishlistsRepository: WishlistsRepository;
  private progressService: ProgressService;

  constructor(
    cartsRepository: CartsRepository,
    wishlistsRepository: WishlistsRepository,
    purchasesRepository: PurchasesRepository,
    coursesRepository: CoursesRepository,
    progressRepository: ProgressRepository,
    progressService: ProgressService
  ) {
    this.cartsRepository = cartsRepository;
    this.wishlistsRepository = wishlistsRepository;
    this.purchasesRepository = purchasesRepository;
    this.coursesRepository = coursesRepository;
    this.progressRepository = progressRepository;
    this.progressService = progressService;
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
      const alreadyPurchased = this.purchasesRepository.findOne({
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

  async createCheckoutSession(
    userId: string | mongoose.Types.ObjectId
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
        success_url: "http://localhost:5173/payment-success",
        cancel_url: "http://localhost:5173/payment-failure",
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
      console.log(":::REACHED CONFIRM::");
      const event = stripe.webhooks.constructEvent(
        requestBody,
        eventHeader,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      let intent = null;
      if (event["type"] === "payment_intent.succeeded") {
        intent = event.data.object;
        const userId = intent.metadata.userId;
        console.log("metadata:::::", intent.metadata);
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
        await this.purchasesRepository.createMany(purchases);
        await this.progressService.createMultipleCourseProgress(
          userId,
          courseIds
        );
        await this.cartsRepository.deleteMany({ user: userId });
        await this.wishlistsRepository.deleteMany({ user: userId });
        console.log("payment succeeded");
        return;
      } else {
        console.log("Payment failed");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
export default new CartsService(
  cartsRepositoryInstance,
  wishlistRepositoryInstance,
  purchasesRepositoryInstance,
  coursesRepositoryInstance,
  progressRepositoryInstance,
  progressServiceInstance
);
