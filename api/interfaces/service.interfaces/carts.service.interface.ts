import mongoose from "mongoose";
import ServiceResponse from "../../types/serviceresponse.type.js";
import ICourses from "../courses.interface.js";

export default interface ICartsService {
  getCount(
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ count: number }>;

  getCart(userId: string | mongoose.Types.ObjectId): ServiceResponse<{
    docs?: ICourses[];
    bill?: { totalPrice: number; totalDiscount: number; finalTotal: number };
  }>;

  addtoCart(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse;

  removeFromCart(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse;

  checkCart(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  );
}
