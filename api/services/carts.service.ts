import mongoose from "mongoose";
import cartsRepositoryInstance, {
  CartsRepository,
} from "../repositories/carts.repository.js";
import { WishlistsRepository } from "../repositories/wishlists.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import ICourses from "../interfaces/courses.interface.js";
import Stripe from "stripe";
import purchasesRepositoryInstance, {
  PurchasesRepository,
} from "../repositories/purchases.repository.js";
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
  private purchasesRepository: PurchasesRepository;
  constructor(
    cartsRepository: CartsRepository,
    purchasesRepository: PurchasesRepository
  ) {
    this.cartsRepository = cartsRepository;
    this.purchasesRepository = purchasesRepository;
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
      throw error;
    }
  }

  async addtoCart(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse {
    try {
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
      throw error;
    }
  }

  async createCheckoutSession(
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ sessionId: string }> {
    try {
      const carts: Cart[] = await this.cartsRepository.find(
        { user: userId },
        { populate: { path: "course", select: "title image price discount" } }
      );
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
      throw error;
    }
  }

  async confirmPurchase(
    eventHeader: string | string[],
    requestBody: string,
    userId: string | mongoose.Types.ObjectId
  ) {
    try {
      stripe.checkout.sessions.retrieve;
      const event = stripe.webhooks.constructEvent(
        requestBody,
        eventHeader,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      let intent = null;
      if (event["type"] === "payment_intent.succeeded") {
        intent = event.data.object;
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
        await this.purchasesRepository.createMany(purchases);
        await this.cartsRepository.deleteMany({ user: userId });
        console.log("payment succeeded");
        return;
      }
      console.log("Payment failed");
    } catch (error) {
      throw error;
    }
  }
}
export default new CartsService(
  cartsRepositoryInstance,
  purchasesRepositoryInstance
);
