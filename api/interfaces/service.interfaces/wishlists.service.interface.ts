import mongoose from "mongoose";
import ServiceResponse from "../../types/serviceresponse.type.js";

export default interface IWishlistsService {
  getCount(
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ count: number }>;

  getWishlist(
    userId: string | mongoose.Types.ObjectId
  ): ServiceResponse<{ docs?: object[] }>;

  addToWishlist(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse;

  removeFromWishlist(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  ): ServiceResponse;

  checkWishlist(
    userId: string | mongoose.Types.ObjectId,
    courseId: string | mongoose.Types.ObjectId
  );
}
