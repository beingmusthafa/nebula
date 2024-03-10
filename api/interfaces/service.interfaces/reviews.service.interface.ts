import mongoose from "mongoose";
import ServiceResponse from "../../types/serviceresponse.type.js";

export default interface IReviewsService {
  addReview(review: {
    user: mongoose.Types.ObjectId | string;
    course: string | mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
  }): ServiceResponse;

  editReview(
    reviewId: string,
    data: { rating?: number; comment?: string }
  ): ServiceResponse;

  deleteReview(reviewId: string): ServiceResponse;

  getReviews(courseId: string): ServiceResponse<{ reviews: object[] }>;
}
