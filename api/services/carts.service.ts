import mongoose from "mongoose";
import { CartsRepository } from "../repositories/carts.repository.js";
import { WishlistsRepository } from "../repositories/wishlists.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import ICourses from "../interfaces/courses.interface.js";
import Stripe from "stripe";
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

export default class CartsService {
  private cartsRepository: CartsRepository;
  constructor() {
    this.cartsRepository = new CartsRepository();
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
}
