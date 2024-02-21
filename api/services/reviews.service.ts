import mongoose from "mongoose";
import reviewsRepositoryInstance, {
  ReviewsRepository,
} from "../repositories/reviews.repository.js";
import ServiceResponse from "../types/serviceresponse.type.js";
import path from "path";

export class ReviewsService {
  private reviewsRepository: ReviewsRepository;
  constructor(reviewsRepository: ReviewsRepository) {
    this.reviewsRepository = reviewsRepository;
  }

  async addReview(review: {
    user: mongoose.Types.ObjectId | string;
    course: string | mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
  }): ServiceResponse {
    try {
      console.log("reachedd service");
      review.comment = review.comment.trim();
      if (!review.comment) delete review.comment;
      else if (review.comment.length > 500) {
        return {
          success: true,
          message: "Comment cannot be more than 200 characters",
          statusCode: 400,
        };
      }
      if (review.rating > 5 || review.rating < 1) {
        return {
          success: true,
          message: "Rating must be between 1 and 5",
          statusCode: 400,
        };
      }
      const alreadyReviewed = await this.reviewsRepository.findOne({
        user: review.user,
        course: review.course,
      });
      if (alreadyReviewed) {
        return {
          success: true,
          message: "You have already reviewed this course",
          statusCode: 400,
        };
      }
      await this.reviewsRepository.create(review);
      return {
        success: true,
        message: "Review added successfully",
        statusCode: 201,
      };
    } catch (error) {
      throw error;
    }
  }

  async editReview(
    reviewId: string,
    data: { rating?: number; comment?: string }
  ): ServiceResponse {
    try {
      data.comment = data.comment?.trim();
      if (!data.comment) delete data.comment;
      if (data.comment?.length > 500) {
        return {
          success: true,
          message: "Comment cannot be more than 200 characters",
          statusCode: 400,
        };
      }
      if (data.rating > 5 || data.rating < 1) {
        return {
          success: true,
          message: "Rating must be between 1 and 5",
          statusCode: 400,
        };
      }
      await this.reviewsRepository.updateOne({ _id: reviewId }, data);
      return {
        success: true,
        message: "Review updated successfully",
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteReview(reviewId: string): ServiceResponse {
    try {
      await this.reviewsRepository.deleteOne({ _id: reviewId });
      return {
        success: true,
        message: "Review deleted successfully",
        statusCode: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  async getReviews(courseId: string): ServiceResponse<{ reviews: object[] }> {
    try {
      const reviews = await this.reviewsRepository.find(
        { course: courseId },
        { populate: { path: "user", select: "name image" } }
      );
      return {
        success: true,
        message: "Reviews fetched successfully",
        statusCode: 200,
        reviews,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new ReviewsService(reviewsRepositoryInstance);
